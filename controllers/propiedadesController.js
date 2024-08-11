import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import {Categoria, Precio, Propiedad} from '../models/index.js'


const admin = async (req, res) => {

    //Comprobar que exista el queryString
    const {pagina: paginaActual} = req.query

    const limit = 2
    const offset = ((paginaActual * limit) - limit)
    
    const expresion = /^[1-9]$/
    if( !expresion.test(paginaActual) ) {
        return res.redirect('/mis-propiedades?pagina=1')
    }
    
    try {
        const {id} = req.usuario

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: {
                    usuarioId: id
                },
                include: [
                    {model: Categoria, as: 'categoria'},
                    {model: Precio, as: 'precio'}
                ]
            }),
            Propiedad.count({
                where: {
                    usuarioId: id
                }
            })
        ])

        //VISTA ↓
        res.render('propiedades/admin', {
            pagina: 'Mis propiedades',
            csrfToken: req.csrfToken(),
            propiedades,
            paginas: Math.ceil(total / limit),
            paginaActual: Number(paginaActual),
            limit,
            offset,
            total
        })        
    } catch (error) {
        console.log(error);
        
    }
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

const editar = async (req, res) => {
   //Comprobar que la propiedad exista
   const propiedad = await Propiedad.findByPk(req.params.id)
   if(!propiedad) {
        return res.redirect('/mis-propiedades')
   }

   //Comprobar que el visitante de la url sea el creador de la propiedad
   if(req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
   }

    //Consultar modelo de Precio y Categoria
    const [categorias, precios] = await  Promise.all([
        Categoria.findAll(),
        Precio.findAll(),
   ])   

   res.render('propiedades/editar', {
       pagina: 'Editar propiedad',
       csrfToken: req.csrfToken(),
       categorias,
       precios,
       datos: propiedad
   })
}

const guardarCambios = async (req, res) => {

    //Comprobar que todos los campos pasen la validacion
    const resultado = validationResult(req)
    if(!resultado.isEmpty()) {
        //Consultar modelo de Precio y Categoria
        const [categorias, precios] = await  Promise.all([
            Categoria.findAll(),
            Precio.findAll(),
        ])

        return res.render('propiedades/editar', {
            pagina: 'Editar propiedad',
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }
    
    //Comprobar que la propiedad exista
    const {id} = req.params
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //Comprobar que el visitante de la url sea el creador de la propiedad
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }
    

    //Guardando el cambio en la base de datos
    const { titulo, descripcion, habitaciones, estacionamiento, wc, 
        calle, lat, lng, precio: precioId, categoria: categoriaId, } = req.body    

    try {
        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })

        await propiedad.save()
        res.redirect('/mis-propiedades')

    } catch (error) {
        console.log(error);
        
    }   
}

const eliminar = async (req, res) => {

    //Comprobar que la propiedad exista
    const {id} = req.params
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }

    //Comprobar que el visitante de la url sea el creador de la propiedad
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    await unlink(`public/uploads/${propiedad.imagen}`)
    await propiedad.destroy()

    res.redirect('/mis-propiedades')
}

const mostrarPropiedad = async (req, res) => {

    //Comprobar que la propiedad exista
    const {id} = req.params
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {model: Categoria, as: 'categoria'},
            {model: Precio, as: 'precio'}
        ]
    })
    if(!propiedad) {
        return res.redirect('/mis-propiedades')
    }


    res.render('propiedades/mostrar', {
        pagina: propiedad.titulo,
        propiedad
    })
}

export {
    admin,
    crear,
    editar,
    guardar,
    agregarImagen,
    guardarImagen,
    guardarCambios,
    eliminar,
    mostrarPropiedad
}