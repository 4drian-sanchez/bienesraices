(function() {
    const lat = 20.67444163271174;
    const lng = -103.38739216304566;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    let propiedades = []
    let markers = new L.FeatureGroup().addTo(mapa)  
    
    const filtros = {
        categoria: '',
        precio: ''
    }
        
    const categoria = document.querySelector('#categorias')
    const precio = document.querySelector('#precios')

    categoria.addEventListener('change', e => {
        filtros.categoria = e.target.value
        filtrarPropiedades()
    })
    precio.addEventListener('change', e => {
        filtros.precio = e.target.value
        filtrarPropiedades()
    })


    //Obteniendo las propiedades por la API creada
    async function obtenerPropiedades() {
        try {
            const url = 'api/propiedades'
            const respuesta = await fetch(url) 
            propiedades = await respuesta.json()
            
            mostrarPropiedades(propiedades);
            
        } catch (error) {
            console.log(error);
   
        }
    }

    function mostrarPropiedades( propiedades ) {

        markers.clearLayers()
        
        propiedades.forEach( propiedad => {
            //Agregar los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            }).addTo(mapa).bindPopup(`
                <h3 class="font-bold text-xs text-indigo-500 mb-2">${propiedad?.categoria?.nombre}</h3>
                <h2 class="text-xl font-bold text-center">${propiedad?.titulo}</h2>
                <img class="h-10 w-10 block" src="uploads/${propiedad?.imagen}" alt="imagen de la propiedad ${propiedad?.titulo}"/>
                <a href="propiedad/${propiedad.id}" class="block mt-2 uppercase text-center font-bold bg-indigo-500 hover:bg-indigo-700 rounded-md py-2 ">Ver propiedad</a>
                `)
                markers.addLayer(marker)
            })
    }

    function filtrarPropiedades() {
         const resultado = propiedades.filter(filtrarCategorias).filter(filtrarPrecios)
         mostrarPropiedades(resultado);
    }
    
    function filtrarCategorias(propiedad) {
        return filtros.categoria ?  propiedad.categoriaId.toString() === filtros.categoria.toString() : propiedad
    }

    function filtrarPrecios(propiedad) {
        return filtros.precio ?  propiedad.precioId.toString() === filtros.precio.toString() : propiedad
    }

    obtenerPropiedades()

})()