import express from "express"
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

//Creacion de la app
const app = express()

//Conexion a la base de datos
try {
    await db.authenticate()
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

//Definir el puerto y arrancar el proyecto
const port = 3000
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);  
})