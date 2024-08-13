import express from "express"
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import appRoutes from './routes/appRoutes.js'
import db from './config/db.js'

//Creacion de la app
const app = express()

//Habilitar lectura de datos de formularios
app.use( express.urlencoded({extended: true}))

//Habilitar Cookie parser
app.use(cookieParser())

//Habilitar CSRF
app.use(csrf({cookie: true}))

//Conexion a la base de datos
try {
    await db.authenticate()
    db.sync()
    console.log('Conexión correcta a la base de datos');
    
} catch (error) {
    console.error(error);
    
}

//Habilitar template engine PUG
app.set('view engine', 'pug');
app.set('views', './views');

//carpeta publica
app.use( express.static('public'))

//routing
app.use('/auth', usuarioRoutes)
app.use('/', appRoutes)
app.use('/', propiedadesRoutes)
app.use('/api', apiRoutes)

//Definir el puerto y arrancar el proyecto
const port = 3000
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);  
})