const express = require('express')
const Song = require('../models/song')
const User = require('../models/user');
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/songsRecieved', async (req, res) => {
    try {
        const songs = await User.find({}, 'songsRecieved')
        res.status(201).send(songs)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/songsLiked', async (req, res) => {
    try {
        const songs = await User.find({}, 'songsLiked')
        res.status(201).send(songs)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/songsPinned', async (req, res) => {
    try {
        const songs = await User.find({}, 'songsPinned')
        res.status(201).send(songs)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/songsSuggested', async (req, res) => {
    try {
        const songs = await User.find({}, 'songsSuggested')
        res.status(201).send(songs)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/songsDisliked', async (req, res) => {
    try {
        const songs = await User.find({}, 'songsDisliked')
        res.status(201).send(songs)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/recommend/:friendId', auth, async (req, res) => {
    //must be friends
    const friendId = req.params.friendId
    const userId = req.user._id
    const song = new Song({
        ...req.body,
        suggestor: userId,
        owner: friendId
    })
    try {
        const friend = await User.findByIdAndUpdate({ _id: friendId }, { $push: { songsRecieved: [song._id] } })
        const user = await User.findByIdAndUpdate({ _id: userId }, { $push: { songsSuggested: [song._id] } })
        await friend.save()
        await user.save()
        res.status(200).send({ user })
    } catch {
        res.status(500).send()
    }
})

router.post('/songs/like/:songId', auth, async (req, res) => {
    const likedSongId = req.params.songId
    try {
        const user = await User.findByIdAndUpdate({ _id: req.user._id }, { $pullAll: { songsRecieved: [likedSongId] }, $push: { songsLiked: [likedSongId] } })
        res.status(200).send({ user })
    } catch {
        res.status(500).send()
    }
})

router.post('/songs/dislike/:songId', auth, async (req, res) => {
    const dislikedSongId = req.params.songId
    try {
        const user = User.findByIdAndUpdate({ _id: req.user._id }, { $pullAll: { songsRecieved: [dislikedSongId] }, $push: { songsDisliked: [dislikedSongId] } })
        res.status(200).send({ user })
    } catch {
        res.status(500).send()
    }
})

module.exports = router