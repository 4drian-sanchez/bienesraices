import {Propiedad, Precio, Categoria} from '../models/index.js'

const propiedades = async (req, res) => {

    try {
        const propiedades = await Propiedad.findAll({
            include: [
                {model: Precio, as: 'precio'},
                {model: Categoria, as: 'categoria'},
            ]
        })
    
        res.json(propiedades)
        
    } catch (error) {
        console.log(error);
    }
}

export {
    propiedades
}