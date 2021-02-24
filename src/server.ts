import 'reflect-metadata'
import express from 'express'
import './database' // por padrão o arquivo index é importado, /index.ts não é necessário informar
import { router } from './routes'

const app = express()

app.use(express.json())
app.use(router)

app.listen(8000, () => {
    console.log('Servidor aberto na porta: 8000')
})