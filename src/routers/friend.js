const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/friends/add/:id', async (req, res) => {
    const _id = req.params.id
    const sender = req.body.senderId
    try {
        const user = await User.findOneAndUpdate({ _id }, { $push: { friendRequests: [sender] } })
        user.save()
        res.status(201).send({ user })
    } catch (e) {
        res.status(400).send(e)
    }

})

module.exports = router