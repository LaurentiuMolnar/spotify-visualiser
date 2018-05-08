const url = require('url');

const express = require('express');
const app = express();
const fetch = require('node-fetch');

const clientId = '79afe7f2eee84dd7be4c3f296f12ec2c';
const clientSecret = 'd0c936cc04614695bf5974435f7ec19b';

const btoa = require('btoa');

app.set('view engine', 'pug');

app.use((req, res, next) => {

    let body = new url.URLSearchParams();
    body.append('grant_type', 'client_credentials');
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret) 
        },
        body: body
    })
    .then(res => res.json())
    .then(data => data['access_token']);
    next();
});

app.get('/', (req, res) => {
    console.log(app.locals.token);
    fetch("https://api.spotify.com/v1/tracks/", {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + req.session.accessToken
        }
    }).then(response => response.json())
    .then(data => res.json(data));

    // res.render('index');
});

app.get('/callback', (req, res) => {
    console.log(req.params);
    res.send();
})

app.listen(3000, () => console.log("Server running on port 3000"));