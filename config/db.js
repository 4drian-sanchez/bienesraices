import Squelize from 'sequelize'
import dotenv from 'dotenv'
dotenv.config({path: '.env'})

const variables = process.env
const db = new Squelize(variables.DB_NOMBRE, variables.DB_USER, variables.DB_PASS ?? '', {
    host: variables.DB_HOST,
    port: 3306,
    dialect: 'mysql',
    define: {
        timestamps: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

export default db