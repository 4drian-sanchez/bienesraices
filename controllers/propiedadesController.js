import { validationResult } from 'express-validator'
import {Categoria, Precio, Propiedad} from '../models/index.js'

const admin = (req, res) => {
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades',
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

        const {id} = propiedadGuardada
        res.redirect(`/propiedades/agregar-imagen/${id}`)
        
    } catch (error) {
        console.log(error);
        
    }
}

const agregarImagen = async (req, res) => {

    const {id} = req.params
    
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }
    
    //Validar que la propiedad no este publicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')        
    }

    //Validar que la propiedad pertenece a quien visita la pagina
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades') 
    }
    
    res.render('propiedades/agregar-imagen', {
        csrfToken: req.csrfToken(),
        pagina: 'Agrega una imagen',
        propiedad
    })
}

const guardarImagen = async (req, res) => {

    const {id} = req.params
    
    //Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }
    
    //Validar que la propiedad no este publicada
    if(propiedad.publicado) {
        return res.redirect('/mis-propiedades')        
    }

    //Validar que la propiedad pertenece a quien visita la pagina
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades') 
    }

    try {
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1
        await propiedad.save()
        res.redirect('/mis-propiedades')
    } catch (error) {
        console.log(error);
        
    }
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    guardarImagen
}