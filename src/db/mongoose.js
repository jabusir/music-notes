const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age : {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot include "password"')
            }
        }
    }
})

const me = new User({
    name: '    Jejo   ',
    email: 'Jaabusir@gmail.com  ',
    password: 'bitchnibba'
})

me.save().then(() => {
    console.log(me)
}).catch((err) => {
    console.log('error: ', err)
})

const Task = mongoose.model('Task', {
    desc: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const Hw = new Task({
    desc: 'Do my hw      ',
})

Hw.save().then(() => {
    console.log(Hw)
}).catch((err) => {
    console.log('error: ', err)
})