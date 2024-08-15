function esVendedor (usuarioId, propiedadUsuaioID)  {
    return usuarioId === propiedadUsuaioID
}

const dateFormatter = fecha => {
    const nuevaFecha = new Date(fecha).toISOString().slice(0, 10)

    const opciones = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    
    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones)
}

export {
    esVendedor,
    dateFormatter
}