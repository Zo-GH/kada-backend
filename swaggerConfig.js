const swaggerJsdoc = require('swagger-jsdoc')
const { config } = require('./config/config')

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'KADA APP',
            version: '1.0.0',
            description: 'API documentation for KADA',
        },
        servers: [
            {
                url: config.BASEURL || "http://localhost:3000/",
                description: 'Development server',
            },
        ],
    },
    apis: ['./swaggerRoutes/*js'],
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec