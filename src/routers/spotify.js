const express = require('express')
const router = new express.Router()
const fetch = require('node-fetch');
const URI = require('urijs');

const CLIENT_ID = '6d5b4de2397a45eca86611ef81315a89'
const CLIENT_SECRET = '5ab92ff24a054d1e85ec8bb65b662a38'


router.get('/login', (req, res) => {

    res.redirect(URI('https://accounts.spotify.com/authorize').setQuery({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPES_STR || '',
        redirect_uri: 'localhost:3001/spotify/callback'
    }));

});

router.get('/callback', (req, res) => {
    res.send('ping');
});


router.get('/token', async (req, res) => {
    const req_payload = CLIENT_ID + ':' + CLIENT_SECRET
    const encoded = (new Buffer.from(req_payload).toString('base64'))

    const reply = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: URI.buildQuery({
            grant_type: 'client_credentials',
        }),
        headers: {
            'Authorization': 'Basic ' + encoded,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
    });

    const payload = await reply.json();
    res.json(payload);

});

router.get('/refresh', async (req, res) => {
    const { refresh_token } = req.query;

    const reply = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: URI.buildQuery({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
    });
    const payload = await reply.json();

    res.json(payload);
});

module.exports = router;


