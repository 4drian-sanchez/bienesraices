import express from "express"
import { 
    formularioLogin,
    autenticar, 
    formularioRegistro, 
    registro, 
    formularioOlvidePassword, 
    confirmar, 
    resetPassword,
    comprobarToken,
    nuevoPassword
 } from "../controllers/usuarioController.js"

const router = express.Router()

router.get('/login', formularioLogin)
router.post('/login', autenticar)

router.get('/registro', formularioRegistro)
router.post('/registro', registro)

//URL dinámica
router.get('/confirmar/:token', confirmar)

router.get('/olvide-password', formularioOlvidePassword)
//Comprueba el token
router.get('/olvide-password/:token', comprobarToken)
//nuevo password
router.post('/olvide-password/:token', nuevoPassword)
router.post('/olvide-password', resetPassword)

export default router