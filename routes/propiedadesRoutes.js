import express from 'express'
import { admin } from '../controllers/propiedadesController.js'

const router = express()

router.get('/mis-propiedades', admin)

export default router