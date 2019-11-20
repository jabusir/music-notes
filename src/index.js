const express = require('express')

const app = express()
const port = process.env.PORT || 3000


//create new user
app.post('/users', (req, res) => {
    res.send('testing!')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

