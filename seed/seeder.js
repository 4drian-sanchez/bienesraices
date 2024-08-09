/* ESTE ARCHIVO SE EJECUTA EN EL PACKAGE.JSON */
import { exit } from 'node:process'
import db from '../config/db.js'
import categorias from './categorias.js'
import precios from './precios.js'
import admin from './admin.js'
import {Precio, Categoria, Usuario} from '../models/index.js'

const importarDatos = async () => {
    try {
        //Autenticar
        await db.authenticate()

        //Generar las columnas
        await db.sync()

        //Insertamos los datos
        //Cuando los querys no estan relacionacion o no dependen entre si, podemos usar Promise.all()
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(admin)
        ])
        
        console.log('Datos importados correctamente');
        exit()
        
    } catch (error) {
        console.log(error);
        exit(1)
    }
}

const eliminarDatos = async () => {

    try {      
        //Se debe eliminar la tabla de propiedades para que el comando npm run db:eliminar funcione
        await Categoria.destroy({
            where: {},
            truncate: true
        })

        await Precio.destroy({
            where: {},
            truncate: true
        })


        console.log('Datos de categorias y precios eliminados');
        exit()

    } catch (error) {
        console.error(error)
        exit(1)
    }

}

//CUENDO SE EJECUTE EL COMANDO EN LA CONSOLA SE IMPORTAN LOS DATOS
if(process.argv[2] === '-i') {
    importarDatos()
}

if(process.argv[2] === '-e') {
    eliminarDatos()
}