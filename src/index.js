const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Song = require('./models/song')
const userRouter = require('./routers/user')
const songRouter = require('./routers/song')
const friendRouter = require('./routers/friend')

const app = express()
const port = process.env.PORT || 3001


app.use(express.json())
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
app.use(userRouter)
app.use(songRouter)
app.use(friendRouter)




app.listen(port, () => {
    console.log('Server is up on port ' + port)
})



// ./\mongodb/bin/mongod.exe --dbpath=./mongodb-data