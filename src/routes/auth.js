module.exports = async (fastify, options) => {

    const crypto = require('crypto')
    const service = fastify.db
    const auth = fastify.auth

    const { loginValidator, refreshValidator } = require.main.require('./validators/auth.js')

    fastify.post('/login', loginValidator, async (req, res) => {

        const user = await service.users.getByUsername(req.body.username)
        if (!user) return res.status(401).send()

        const hash = crypto.createHash('sha512').update(req.body.password).digest('hex')
        if (hash != user.hash) return res.status(401).send()

        const role = await service.roles.getByName(user.role)
   
        return await auth.authenticate(user.username, role.permissions)
    })

    fastify.post('/logout', {schema: {headers: refreshValidator.schema.headers}}, async (req, res) => {

        const success = await auth.deauthorize(req.headers.authorization)
        if(!success) return res.status(410).send()

        return res.status(204).send()
    })

    fastify.post('/refresh', refreshValidator, async (req, res) => {

        const refreshed = await auth.refresh(req.headers.authorization)
        if (!refreshed) return res.status(410).send()

        return refreshed
    })

    fastify.get('/verify', {schema: {headers: refreshValidator.schema.headers}}, async (req, res) => {

        const verified = await auth.authorize(req.headers.authorization)
        if (!verified) return res.status(401).send()

        return res.status(200).send()
    })
}
