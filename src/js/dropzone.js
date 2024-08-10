import { Dropzone } from "dropzone"

const token = document.querySelector('meta[name="csrf-token"]').content

Dropzone.options.imagen = {
    dictDefaultMessage: 'Súbe tu imagen aqui',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    paralleUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'El limite es 1 archivo',
    headers: {
        'CSRF-token': token
    },
    paramName: 'imagen',
    init: function() {


        const dropzone = this
        const btnDropzone = document.querySelector('#publicar')
        console.log(btnDropzone);
        
        btnDropzone.addEventListener('click', function() {
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function() {
            if(dropzone.getActiveFiles().length == 0) {
                window.location.href="/mis-propiedades"
            }
        })
    }
}