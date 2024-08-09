import Categoria from "./Categoria.js";
import Precio from "./Precio.js";
import Propiedad from "./Propiedad.js";
import Usuario from "./Usuario.js";

Propiedad.belongsTo(Precio, {
    foreignKey: 'precioId'
})

Propiedad.belongsTo(Usuario, {
    foreignKey: 'usuarioId'
})

Propiedad.belongsTo(Categoria, {
    foreignKey: 'categoriaId'
})

export {
    Categoria,
    Precio,
    Propiedad,
    Usuario
}