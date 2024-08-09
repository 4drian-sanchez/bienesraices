(function() {
    const lat = document.querySelector('input[name="lat"]').value || 20.67444163271174;
    const lng = document.querySelector('input[name="lng"]').value || -103.38739216304566;
    const mapa = L.map('mapa').setView([lat, lng ], 18);
    let marker

    //Utilizar provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService() 
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa)

    //Detectar el movimiento del pin
    marker.on('moveend', function(e){
        marker = e.target
        const position = marker.getLatLng()
        mapa.panTo(new L.LatLng(position.lat, position.lng))
        
        //Obtener la información de las calles al soltar el pin
        geocodeService.reverse().latlng(position, 13).run(function(e, r) {
            marker.bindPopup(r.address.LongLabel)
            
            //Asignando valores a campos ocultos
            document.querySelector('#calle').textContent = r.address.Address
            document.querySelector('input[name="calle"]').value = r.address.Address
            document.querySelector('input[name="lat"]').value = r.latlng.lat
            document.querySelector('input[name="lng"]').value = r.latlng.lng
        })
    })


})()