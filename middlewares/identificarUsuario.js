import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const identificarUsuario = async (req, res, next) => {

    //Comprobar que el token sea válido
    const { _JWT } = req.cookies
    if(!_JWT) {
        Usuario.req = null
        return next()
    }
    
    //verificar si el JWT es valido
    try {
        const decoded = jwt.verify(_JWT, process.env.JWT_PASSWORD)
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)

        if(usuario) {
            req.usuario = usuario
        }else {
            return res.redirect('/auth/login')
        }
        return next()
    } catch (error) {
        return res.clearCookie('_JWT').redirect('/auth/login')
    }

}

export default identificarUsuario