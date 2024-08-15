import Categoria from "./Categoria.js";
import Precio from "./Precio.js";
import Propiedad from "./Propiedad.js";
import Usuario from "./Usuario.js";
import Mensaje from "./Mensaje.js";

Propiedad.belongsTo(Precio, {
    foreignKey: 'precioId'
})

Propiedad.belongsTo(Usuario, {
    foreignKey: 'usuarioId'
})

Propiedad.belongsTo(Categoria, {
    foreignKey: 'categoriaId'
})

/* Una propiedad puede tener multtiples mensajes */
Propiedad.hasMany(Mensaje, { 
    foreignKey: 'propiedadId'
})

//Asociaciones de los mensajes
Mensaje.belongsTo(Usuario, {
    foreignKey: 'usuarioId'
})

Mensaje.belongsTo(Propiedad, {
    foreignKey: 'propiedadId'
})



export {
    Categoria,
    Precio,
    Propiedad,
    Usuario
}