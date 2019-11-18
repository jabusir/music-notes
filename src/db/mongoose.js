const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validate.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    age : {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    }
})

// const me = new User({
//     name: 'Jejo',
//     age: 21
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((err) => {
//     console.log('error: ', err)
// })

const Task = mongoose.model('Task', {
    desc: {
        type: String
    },
    completed: {
        type: Boolean
    }
})

const Hw = new Task({
    desc: 'Do my hw',
    completed: false
})

Hw.save().then(() => {
    console.log(Hw)
}).catch((err) => {
    console.log('error: ', err)
})