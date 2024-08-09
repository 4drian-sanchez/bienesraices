import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'

const protegerRuta = async (req, res, next) => {
    const {_JWT} = req.cookies
    
    //veerificar si existe un JWT
    if(!_JWT) {
        return res.redirect('/auth/login')
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

export default protegerRuta