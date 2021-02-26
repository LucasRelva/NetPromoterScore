import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveyRepository } from '../repositories/SurveyRepository'
import { SurveyUserRepository } from '../repositories/SurveyUserRepository'
import { UserRepository } from '../repositories/UserRepository'
import SendMailService from '../services/SendMailService'
import { resolve } from 'path'

class SendMailController {
    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body

        const userRepository = getCustomRepository(UserRepository)
        const surveyRepository = getCustomRepository(SurveyRepository)
        const surveyUserRepository = getCustomRepository(SurveyUserRepository)

        const userAlreadyExists = await userRepository.findOne({ email })
        const surveyAlreadyExists = await surveyRepository.findOne({ id: survey_id })

        if (!userAlreadyExists)
            return res.status(400).json({ error: 'User does not exists' })


        const variables = {
            name: userAlreadyExists.name,
            title: surveyAlreadyExists.title,
            description: surveyAlreadyExists.description,
            user_id: userAlreadyExists.id,
            link: process.env.URL_MAIL
        }

        const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

        if (!surveyAlreadyExists)
            return res.status(400).json({ error: 'Survey does not exists' })

        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where: [{ user_id: userAlreadyExists.id }, { value: null }],
            relations: ['user', 'survey']
        })

        if (surveyUserAlreadyExists) {
            await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath)
            return res.json(surveyUserAlreadyExists)
        }

        const surveyUser = surveyUserRepository.create({
            user_id: userAlreadyExists.id,
            survey_id
        })

        await surveyUserRepository.save(surveyUser)

        await SendMailService.execute(email, surveyAlreadyExists.title, variables, npsPath)

        return res.json(surveyUser)
    }
}

export { SendMailController }