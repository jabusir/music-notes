const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
require('./db/mongoose')
const User = require('./models/user')
const Song = require('./models/song')
const userRouter = require('./routers/user')
const songRouter = require('./routers/song')
const friendRouter = require('./routers/friend')
const spotifyRouter = require('./routers/spotify')

const app = express()
const port = process.env.PORT || 3001

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use('/spotify', spotifyRouter)
app.use(userRouter)
app.use(songRouter)
app.use(friendRouter)



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})



// ./\mongodb/bin/mongod.exe --dbpath=./mongodb-data