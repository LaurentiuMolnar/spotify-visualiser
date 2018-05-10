const url = require('url');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const fetch = require('node-fetch');
const path = require('path');

const clientId = '79afe7f2eee84dd7be4c3f296f12ec2c';
const clientSecret = 'd0c936cc04614695bf5974435f7ec19b';

const btoa = require('btoa');

app.locals.limit = 10;

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(req.path);
    next();
});

app.get('/', (req, res) => {

    let body = new url.URLSearchParams();
    body.append('grant_type', 'client_credentials');

    fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ":" + clientSecret)
        },
        body: body
    }).then(response => {
        response.json()
            .then(data => res.render('index', {
                token: data['access_token']
            }))
            .catch(err => console.log(err));
    }).catch(err => console.log(err));
});

app.get('/tracks', (req, res) => {
    // console.log(req.query);
    fetch('https://api.spotify.com/v1/search/?q='+req.query.q+'&type=track&limit='+app.locals.limit, {
        method: "GET",
        headers: {
            "Authorization": 'Bearer ' + req.query.accessToken
        }
    })
    .then(response => {
        response.json()
            .then(data => {
                data = data.tracks.items
                    .filter(el => el['preview_url'] != null)
                    .map(el => {
                        return {
                            artists: el.artists.map(el => ({name: el.name})),
                            href: el.href,
                            name: el.name,
                            preview_url: el.preview_url,
                            uri: el.uri,
                            id: el.id,
                            image: el.album.images[2]
                        }
                    })
                    ;
                res.json(data);
                // console.log(data);
            })
            .catch(err => console.log(err));
    })
    .catch(err => {console.log(err); res.status(404); res.render("404");});
})

app.use('/public', express.static(path.join(__dirname, 'public/')));
app.listen(3000, () => console.log("Server running on port 3000"));