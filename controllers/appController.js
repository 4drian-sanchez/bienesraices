import { Sequelize } from 'sequelize'
import {Precio, Categoria, Propiedad} from '../models/index.js'

const inicio = async (req, res) => {

    const [precios, categorias, casas, departamentos] = await Promise.all([
        Precio.findAll({raw: true}),
        Categoria.findAll({raw: true}),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 1
            },
            include: [
                {model: Precio, as: 'precio'}
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            where: {
                categoriaId: 2
            },
            include: [
                {model: Precio, as: 'precio'}
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ])

    res.render('inicio', {
        csrfToken: req.csrfToken(),
        pagina: 'inicio',
        precios,
        categorias,
        casas,
        departamentos
    })
}

const categoria = async (req, res) => {
    const { id } = req.params
    
    //Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id) 
    if(!categoria) {
        return res.redirect('/404')
    }
    
    const propiedades = await Propiedad.findAll({
        where: {
            categoriaId: id
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('categoria', {
        pagina: `${categoria.nombre}s en venta`,
        csrfToken: req.csrfToken(),
        propiedades
    })
    
}

const noEncontrado = (req, res) => {
    res.render('404', {
        pagina: 'No encontrada',
        csrfToken: req.csrfToken(),
    })
}

const buscador = async (req, res) => {
    
    const { termino } = req.body
    
    if(!termino) {
        res.redirect('back')
    }

    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },
        include: [
            {model: Precio, as: 'precio'}
        ]
    })

    res.render('busqueda', {
        pagina: `Resultados de ${termino}`,
        propiedades,
        csrfToken: req.csrfToken()
    })
    
}

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}