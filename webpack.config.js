import path from 'path'

export default {
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
        dropzone: './src/js/dropzone.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}