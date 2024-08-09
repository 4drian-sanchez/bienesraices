import { validationResult } from 'express-validator'
import {Categoria, Precio, Propiedad} from '../models/index.js'

const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades',
        barra: true
    })
}

const crear = async (req, res) => {

    //Consultar modelo de Precio y Categoria
    const [categorias, precios] = await  Promise.all([
         Categoria.findAll(),
         Precio.findAll(),
    ])

    res.render('propiedades/crear', {
        pagina: 'Crear propiedad',
        csrfToken: req.csrfToken(),
        barra: true,
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req, res) => {
    
    //validacion
    const resultado = validationResult(req)
    if(!resultado.isEmpty()) {
        //Consultar modelo de Precio y Categoria
        const [categorias, precios] = await  Promise.all([
            Categoria.findAll(),
            Precio.findAll(),
        ])

        return res.render('propiedades/crear', {
            pagina: 'Crear propiedad',
            csrfToken: req.csrfToken(),
            barra: true,
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    const { titulo, descripcion, habitaciones, estacionamiento, wc, 
        calle, lat, lng, precio: precioId, categoria: categoriaId, } = req.body

    const {id: usuarioId} = req.usuario
    
    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            imagen: '',
            precioId,
            usuarioId,
            categoriaId,
        })
    } catch (error) {
        console.log(error);
        
    }
    
}

export {
    admin,
    crear,
    guardar
}