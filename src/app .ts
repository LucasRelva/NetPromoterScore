import 'reflect-metadata'
import express from 'express'
import createConnection from './database' // por padrão o arquivo index é importado, /index.ts não é necessário informar
import { router } from './routes'

createConnection()
const app = express()

app.use(express.json())
app.use(router)

export { app }