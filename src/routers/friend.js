const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/friends/add/:id', async (req, res) => {
    const _id = req.params.id
    const senderId = req.body.senderId
    try {
        let user = await User.findByIdAndUpdate({ _id }, { $push: { friendRequestsRecieved: [senderId] } })
        const sender = await User.findByIdAndUpdate({ _id: senderId }, { $push: { friendRequestsSent: [_id] } })
        await sender.save()
        await user.save()
        res.status(201).send({ user })
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/friends/accept/', async (req, res) => {
    const { senderId, _id } = req.body
    try {
        let user = await User.findByIdAndUpdate({ _id }, { $pullAll: { friendRequestsRecieved: [senderId] }, $push: { friends: [senderId] } })
        await user.save()
        let sender = await User.findByIdAndUpdate({ _id: senderId }, { $pullAll: { friendRequestsSent: [_id] }, $push: { friends: [_id] } })
        await sender.save()

        console.log(user, sender)
        //remove user from requsted list of sender
        res.status(201).send({ user })
    } catch (e) {
        res.status(500).send(e)
    }

})

router.post('/friends/decline/', async (req, res) => {
    const { senderId, _id } = req.body
    try {
        let user = await User.findByIdAndUpdate({ _id }, { $pullAll: { friendRequestsRecieved: [senderId] } })
        let sender = await User.findByIdAndUpdate({ _id: senderId }, { $pullAll: { friendRequestsSent: [_id] } })
        await sender.save()
        await user.save()
        res.status(201).send({ user })
        //remove user from requsted list of sender
    } catch (e) {
        res.status(400).send(e)
    }

})

module.exports = router