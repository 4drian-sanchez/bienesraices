import express from 'express'
import { body } from 'express-validator'
import { 
    admin, 
    crear, 
    guardar, 
    agregarImagen, 
    guardarImagen, 
    editar, 
    guardarCambios, 
    eliminar,
    mostrarPropiedad,
    guardarMensaje,
    mostrarMensajes,
    cambiarEstado
} from '../controllers/propiedadesController.js'
import protegerRuta from '../middlewares/protegerRuta.js'
import upload from '../middlewares/subirImagen.js'
import identificarUsuario from '../middlewares/identificarUsuario.js'

const router = express()

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/crear', protegerRuta, crear)
router.post('/propiedades/crear', 
    protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo no puede ir vacio'),
    body('descripcion')
        .notEmpty().withMessage('la descripcion no puede ir vacia')
        .isLength({max: 500}).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Seleccione una categoría'),
    body('precio').isNumeric().withMessage('Seleccione un precio'),
    body('habitaciones').isNumeric().withMessage('Seleccione el numero de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Seleccione el numero de estacionamientos'),
    body('wc').isNumeric().withMessage('Seleccione el numero de baños'),
    body('lat').notEmpty().withMessage('Seleccione la ubicacion de su propiedad en el mapa'),
    guardar
)

router.get('/propiedades/agregar-imagen/:id', 
    protegerRuta,
    agregarImagen
)

router.post('/propiedades/agregar-imagen/:id',
    protegerRuta, 
    upload.single('imagen'),
    guardarImagen
)

router.get('/propiedades/editar/:id', 
    protegerRuta,
    editar
)

router.post('/propiedades/editar/:id',
    protegerRuta,
    body('titulo').notEmpty().withMessage('El titulo no puede ir vacio'),
    body('descripcion')
        .notEmpty().withMessage('la descripcion no puede ir vacia')
        .isLength({max: 500}).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Seleccione una categoría'),
    body('precio').isNumeric().withMessage('Seleccione un precio'),
    body('habitaciones').isNumeric().withMessage('Seleccione el numero de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Seleccione el numero de estacionamientos'),
    body('wc').isNumeric().withMessage('Seleccione el numero de baños'),
    body('lat').notEmpty().withMessage('Seleccione la ubicacion de su propiedad en el mapa'),
    guardarCambios
)

router.post('/propiedades/eliminar/:id',
    protegerRuta,
    eliminar
)

router.put('/propiedades/:id',
    protegerRuta,
    cambiarEstado
)

//Ruta de los mensajes
router.get('/mensajes/:id', 
    protegerRuta,
    mostrarMensajes
)

//Rutas publicas
router.get('/propiedad/:id',
    identificarUsuario,
    mostrarPropiedad
)

router.post('/propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({min: 10}).withMessage('El mensaje es muy corto'),
    guardarMensaje
)


export default router