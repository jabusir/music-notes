const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Song = require('./song');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot include "password"')
            }
        }
    },
    friendRequestsSent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friendRequestsRecieved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    songsRecieved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    songsGiven: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    songsSuggested: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    songsLiked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    songsDisliked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],

    savedSongs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    songsPinned: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


userSchema.methods.generateAuthToken = async function () {
    const user = this
    //switch to env variable before production
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//Has the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User