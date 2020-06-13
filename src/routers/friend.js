const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/friends/add/:id', auth, async (req, res) => {
    const _id = req.params.id
    const senderId = req.user._id
    console.log(senderId)
    try {
        let user = await User.findByIdAndUpdate({ _id }, { $push: { friendRequestsRecieved: [senderId] } })
        let sender = await User.findByIdAndUpdate({ _id: senderId }, { $push: { friendRequestsSent: [_id] } })
        await sender.save()
        await user.save()
        res.status(201).send({ user })
    } catch (e) {
        await User.findByIdAndUpdate({ _id: senderId }, { $pull: { friendRequestsSent: [_id] } })
        res.status(400).send(e)
    }

})

router.post('/friends/accept', auth, async (req, res) => {
    const { senderId, _id } = req.body
    try {
        let user = await User.findByIdAndUpdate({ _id }, { $pullAll: { friendRequestsRecieved: [senderId] }, $push: { friends: [senderId] } })
        let sender = await User.findByIdAndUpdate({ _id: senderId }, { $pullAll: { friendRequestsSent: [_id] }, $push: { friends: [_id] } })
        await user.save()
        await sender.save()

        console.log(user, sender)
        //remove user from requsted list of sender
        res.status(201).send({ user })
    } catch (e) {
        res.status(500).send(e)
    }

})

router.post('/friends/decline', auth, async (req, res) => {
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