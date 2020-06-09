const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/friends/add/:id', async (req, res) => {
    const _id = req.params.id
    const senderId = req.body.senderId
    try {
        let user = await User.findOneAndUpdate({ _id }, { $push: { friendRequestsRecieved: [senderId] } })
        const sender = await User.findByIdAndUpdate({ _id: senderId }, { $push: { friendRequestsSent: [_id] } })
        user.save()
        res.status(201).send({ user })
    } catch (e) {
        res.status(400).send(e)
    }

})


module.exports = router