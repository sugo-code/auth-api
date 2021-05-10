module.exports = async (fastify, options) => {

    const crypto = require('crypto')
    const service = fastify.db
    const auth = fastify.auth

    const { loginValidator, refreshValidator } = require.main.require('./validators/auth.js')

    fastify.post('/login', loginValidator, async (req, res) => {

        const user = await service.users.getByUsername(req.body.username)
        if (!user) return res.status(401).send()

        const hash = crypto.createHash('sha512').update(req.body.password).digest('hex')
        if (hash != user.password) return res.status(401).send()

        const role = await service.roles.getByRole(user.role)

        return await auth.authenticate(user.username, role.role)
    })

    fastify.post('/logout', async (req, res) => {

        if (user) return res.status(409).send()

        const hash = crypto.createHash('sha512').update(req.body.password).digest('hex')
        const created = await service.users.create({ username: req.body.username, password: hash })
        if (!created) return res.status(500).send()

        return res.status(201).send()
    })

    fastify.post('/refresh', refreshValidator, async (req, res) => {

        const user = await auth.authorize(req.headers.authorization)

        const username = await service.users.getByUsername(user)
        const role = await service.roles.getByRole(username.role)

        const refreshed = await auth.refresh(username, role)
        if (!refreshed) return res.status(400).send()

        return refreshed
    })
}