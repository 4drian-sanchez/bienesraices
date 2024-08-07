import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    const {nombre, email, token} = datos

    //Enviar el email
    await transport.sendMail({
        from: 'Bienesraices.com',
        to: email,
        subject:  'Confirma tu cuenta en bienesraices.com',
        text: 'Confirma tu cuenta en bienesraices.com',
        html: `
            <p>Hola ${nombre} confirma tu cuenta en bienesraices.con</p>

            <p>Tu cuenta esta lista, solo debes confirmarla en el siguiente enlace <a href="${process.env.HOST}:${process.env.PORT}/auth/confirmar/${token}">Confirmar cuenta</a></p>
        `
    })
}

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    const {nombre, email, token} = datos

    //Enviar el email
    await transport.sendMail({
        from: 'Bienesraices.com',
        to: email,
        subject:  'Cambia tu contraseña en bienesraices.com',
        text: 'Cambia tu contraseña en bienesraices.com',
        html: `
            <p>Hola ${nombre} Cambia tu contraseña en bienesraices.con</p>

            <p>Abre el siguiente enlace y <a href="${process.env.HOST}:${process.env.PORT}/auth/olvide-password/${token}">Cambia tu contraseña</a></p>
            <p>
                Si no quieres cambiar tu contraseña ignora este mensaje.
            </p>
        `
    })
}

export {
    emailRegistro,
    emailOlvidePassword
}
