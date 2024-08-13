import express from 'express'
import { 
    buscador,
    categoria,
    inicio, 
    noEncontrado
} from '../controllers/appController.js'

const router = express.Router()

//Inicio
router.get('/', inicio)

//Categorias
router.get('/categorias/:id', categoria)

//404
router.get('/404', noEncontrado)

router.post('/buscador', buscador)
export default router


