import request from 'supertest'
import { app } from '../app '
import createConnection from '../database'

describe('Users', () => {
    beforeAll(async () => {
        const connection = await createConnection()
        await connection.runMigrations()
    })

    it('should be able to create a new user', async () => {
        const res = await request(app).post('/users').send({
            name: 'teste',
            email: 'teste@teste.com'
        }) 
        expect(res.status).toBe(201)
    })

    it('should not be able to create a new user with same email', async () => {
        const res = await request(app).post('/users').send({
            name: 'teste',
            email: 'teste@teste.com'
        }) 
        expect(res.status).toBe(400)
    })
}) 