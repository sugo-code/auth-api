require('dotenv').config()

const fastify = require('fastify')({ logger: true })

fastify.decorate('db', require('./decorators/mongo.js'))
fastify.decorate('auth', require('./decorators/jwt'))
fastify.decorate('bus', require('./decorators/rabbitmq'));

fastify.register(require('fastify-cors'), { origin: '*' })
fastify.register(require('./routes/auth'))

fastify.listen(process.env.PORT || 3000, '0.0.0.0', (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
    fastify.bus.init()
})