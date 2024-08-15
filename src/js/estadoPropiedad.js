(function(){
    const token = document.querySelector('meta[name="CSRF-token"]').content
    const btns = document.querySelectorAll('.cambiarEstado')

    btns.forEach( btnEstado => {
        btnEstado.addEventListener('click', cambiarEstado)
    })
    
    async function cambiarEstado(e) {

        const {propiedadId: id} = e.target.dataset

        try {
            const url = `/propiedades/${id}`
            const res = await fetch( url, {
                method: 'PUT',
                headers: {
                    'CSRF-token': token
                }
            })
            const result = await res.json()

            if(result) {
                if(e.target.classList.contains('bg-yellow-500')) {
                    e.target.classList.add('bg-green-500')
                    e.target.classList.remove('bg-yellow-500')
                    e.target.textContent= 'Publicado'
                }else {
                    e.target.classList.add('bg-yellow-500')
                    e.target.classList.remove('bg-green-500')
                    e.target.textContent= 'No publicado'
                }
            }
            
        } catch (error) {
            console.log(error);
            
        }
        
    }   
})()