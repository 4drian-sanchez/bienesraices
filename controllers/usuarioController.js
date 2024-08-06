const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar sesión'
    })
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta'
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'No pierdas acceso a BienesRaíces'
    })
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword
}