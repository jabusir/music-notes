//CRUD create read update delete

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (err, client) => {
    if (err) {
       return console.log('Unable to connect to database!')
    }

    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //     name: 'Jejo',
    //     age: 21
    // }, (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert User')
    //     }

    //     console.log(res.ops)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 28,
    //     }, {
    //         name: 'Gunther',
    //         age: 27
    //     }
    // ], (err, res) => {
    //     if (err) {
    //         return console.log('Unable to insert documents!')
    //     }
    //     console.log(res.ops)
    // })

    db.collection('tasks').insertMany([
        {
            desc: 'work out',
            completed: false
        }, {
            desc: 'study',
            completed: false,
        },{
            desc: 'eat',
            completed: true
        }
    ], (err, res) => {
        if (err) {
            return console.log('Unable to add documents')
        }
        console.log(res.ops)
    })
})
