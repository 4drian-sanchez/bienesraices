import path from 'path'

export default {
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
        mostrarMapa: './src/js/mostrarMapa.js',
        mapaInicio: './src/js/mapaInicio.js',
        dropzone: './src/js/dropzone.js',
        estadoPropiedad: './src/js/estadoPropiedad.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}