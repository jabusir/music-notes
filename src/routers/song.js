const express = require('express')
const Song = require('../models/song')
const User = require('../models/user');
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/songsRecieved', auth, async (req, res) => {
    try {
        const userId = req.user._id
        const songs = await User.findOne({ _id: userId }, 'songsRecieved').populate({ path: 'songsRecieved' })
        console.log(songs)
        res.status(201).send(songs)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/songsLiked', auth, async (req, res) => {
    try {
        const userId = req.user._id
        const songs = await User.find({ _id: userId }, 'songsLiked').populate({ path: 'songsLiked' })
        res.status(201).send(songs)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/songsPinned', auth, async (req, res) => {
    try {
        const userId = req.user._id
        const songs = await User.find({ _id: userId }, 'songsPinned').populate({ path: 'songsPinned' })
        res.status(201).send(songs)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/songsSuggested', auth, async (req, res) => {
    try {
        const userId = req.user._id
        const songs = await User.find({ _id: userId }, 'songsSuggested').populate({ path: 'songsSuggested' })
        res.status(201).send(songs)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/songsDisliked', auth, async (req, res) => {
    try {
        const userId = req.user._id
        const songs = await User.find({ _id: userId }, 'songsDisliked').populate({ path: 'songsDisliked' })
        res.status(201).send(songs)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/recommend/:friendId', auth, async (req, res) => {
    const friendId = req.params.friendId
    const userId = req.user._id
    try {
        const song = new Song({
            ...req.body,
            suggestor: userId,
            owner: friendId
        })
        song.save()
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

router.post('/songs/pin/:songId', auth, async (req, res) => {
    const dislikedSongId = req.params.songId
    try {
        const user = User.findByIdAndUpdate({ _id: req.user._id }, { $pullAll: { songsRecieved: [dislikedSongId] }, $push: { songsPinned: [dislikedSongId] } })
        res.status(200).send({ user })
    } catch {
        res.status(500).send()
    }
})

module.exports = router