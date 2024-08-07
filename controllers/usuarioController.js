import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import {generarId, generarJWT} from '../helpers/token.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/email.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        csrfToken:req.csrfToken(),
        pagina: 'Iniciar sesión'
    })
}

const autenticar = async (req, res) => {
    //validacion 
    await check('email').isEmail().withMessage('El email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req)
    const { email } = req.body
    
    //Comprueba si existe errores para mostrar en la interfaz
    let resultado = validationResult(req)
    if(!resultado.isEmpty()) {
        return res.render('auth/login', {
            csrfToken:req.csrfToken(),
            email,
            pagina: 'Iniciar sesión',
            errores: resultado.array(),       
        })
    }

    //Comprobar si el usuario existe
    const usuario = await Usuario.findOne({where: {email}})
    if(!usuario) {
        return res.render('auth/login', {
            csrfToken:req.csrfToken(),
            pagina: 'Iniciar sesión',
            email,
            errores: [{msg: 'El usuario no existe'}],       
        }) 
    }

    //Comprobar si el usuario no ha confirmado su cuenta
    if(!usuario.confirmado) {
        return res.render('auth/login', {
            csrfToken:req.csrfToken(),
            pagina: 'Iniciar sesión',
            email,
            errores: [{msg: 'El usuario no ha confirmado su cuenta'}],       
        })
    }

    //Comprobar la contraseña
    if(!usuario.verificarPassword(req.body.password)) {
        return res.render('auth/login', {
            csrfToken:req.csrfToken(),
            pagina: 'Iniciar sesión',
            email,
            errores: [{msg: 'La contraseña es incorrecta'}],
        })        
    }

    //Creando el JWT y almacenando en las cookies
    const token = generarJWT({nombre: usuario.nombre, id: usuario.id})
    
    return res.cookie('_JWT', token, {
        httpOnly: true
    }).redirect('/mis-propiedades')
    
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
        csrfToken:req.csrfToken()
    })
}

const registro = async (req, res) => {

    //validacion 
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await check('email').isEmail().withMessage('El email no es valido').run(req)
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Los Passwords no son iguales').run(req)
    
    //Comprueba si existe errores para mostrar en la interfaz
    let resultado = validationResult(req)
    if(!resultado.isEmpty()) {
        return res.render('auth/registro', {
            csrfToken:req.csrfToken(),
            pagina: 'Crear cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }            
        })
    }

    //Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne( { where: { email : req.body.email} } )
    if(existeUsuario) {
        return res.render('auth/registro', {
            csrfToken:req.csrfToken(),
            pagina: 'Crear cuenta',
            errores: [{msg: "EL correo electrónico ya se encuentra registrado"}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }            
        })
    }
    
    //Creacion del usuario en el modelo
    const usuario = await Usuario.create({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
        token: generarId()
    }) 

    //EMAIL DE CONFIRMACION DE CUENTA
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrar mensaje de creacion de cuenta con exito
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un E-mail de verificación, presiona en el enlace'
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        csrfToken: req.csrfToken(),
        pagina: 'No pierdas acceso a BienesRaíces'
    })
}

const resetPassword = async (req, res) => {
    
    //validacion 
    await check('email').isEmail().withMessage('El email no es valido').run(req)
    
    //Comprueba si existe errores para mostrar en la interfaz
    let resultado = validationResult(req)
    if(!resultado.isEmpty()) {
        return res.render('auth/olvide-password', {
            csrfToken: req.csrfToken(),
            pagina: 'No pierdas acceso a BienesRaíces',
            errores: resultado.array()        
        })
    }

    //Buscar el email del usuario
    const {email} = req.body
    const usuario = await Usuario.findOne({where: {email}})
    
    if(!usuario) {
        return res.render('auth/olvide-password', {
            csrfToken: req.csrfToken(),
            pagina: 'No pierdas acceso a BienesRaíces',
            errores: [{msg: 'El correo no se encuentra registrado'}]       
        })
    }

    //Generar un token y enviar el email
    usuario.token = generarId()
    await usuario.save()

    //Enviar el email
    emailOlvidePassword(usuario)
    
    //Renderizar un mensaje
    res.render('templates/mensaje', {
        csrfToken: req.csrfToken(),
        pagina: 'Cambia tu contraseña',
        mensaje: 'Ingresa a tu correo electonico y sigue las instrucciones para cambiar tu contraseña'
    })
}

const comprobarToken = async (req, res) => {
    const {token} = req.params

    const usuario = await Usuario.findOne({where: {token}})

    //Si el token no existe muestra mensaje de error
    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Cambia tu contraseña',
            mensaje: 'Hubo un error al cambiar la contraseña, intenta de nuevo.',
            error: true
        })
    }

    //Mostrar formulario de nueva contraseña
    res.render('auth/nuevo-password', {
        pagina: 'Cambia tu contraseña',
        csrfToken: req.csrfToken()
    })
}

const nuevoPassword = async (req, res) => {

    //Validacion
    await check('password').isLength({min: 6}).withMessage('La contraseña debe contener almeenos 6 caracteres').run(req)

    let resultado = validationResult(req)
    if(!resultado.isEmpty()) {
        return res.render('auth/nuevo-password', {
            pagina: 'Cambia tu contraseña',
            csrfToken: req.csrfToken(),
            errores: resultado.array()        
        })
    }

    //Usuario
    const { token } = req.params
    const usuario = await Usuario.findOne({where: {token}})
    
    //Hashear el password
    const { password } = req.body
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    usuario.token = null
    await usuario.save()

    //Mostrar vista
    res.render('auth/confirmar-cuenta', {
        pagina: 'Contraseña restablecida',
        mensaje: 'La contraseña se guardo correctamente'
    })
}

const confirmar = async (req, res) => {
    
    const {token} = req.params
    
    //Validar si el token es válido
    const usuario = await Usuario.findOne({where: {token}})
    if(!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })
    }

    //Confirmar la cuenta
    usuario.token = null
    usuario.confirmado = true
    await usuario.save()
    
    //Mostrar vista
    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta confirmada correctamente',
        mensaje: 'Confirmaste tu cuenta con exito.',
    })
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registro,
    formularioOlvidePassword,
    resetPassword,
    confirmar,
    comprobarToken,
    nuevoPassword
}