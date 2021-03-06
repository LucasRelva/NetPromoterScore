import request from 'supertest'
import { app } from '../app '
import createConnection from '../database'

describe('Surveys', () => {
    beforeAll(async () => {
        const connection = await createConnection()
        await connection.runMigrations()
    })

    it('should be able to create a new survey', async () => {
        const res = await request(app).post('/surveys').send({
            title: 'teste',
            description: 'teste descrição'
        }) 
        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('id')
    })

    it('should be able to get all surveys', async () => {
        await request(app).post('/surveys').send({
            title: 'teste2',
            description: 'teste descrição2'
        }) 

        const res = await request(app).get('/surveys')

        expect(res.body.length).toBe(2)
    })

}) 