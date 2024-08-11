(function(){
    let lat = document.querySelector('#lat').textContent
    let lng = document.querySelector('#lng').textContent
    let calle = document.querySelector('#calle').textContent

    const mapa = L.map('mostrarMapa').setView([lat, lng], 16)
        
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //agregar el pin
    L.marker([lat, lng]).addTo(mapa).bindPopup(calle)

})()