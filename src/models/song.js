const mongoose = require('mongoose')

const Song = mongoose.model('Song', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    suggestor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    playback_uri: {
        type: String
    },
    spotify_id: {
        type: String
    },
    times_suggested: {
        type: Number,
        default: 0
    }
}))

module.exports = Song