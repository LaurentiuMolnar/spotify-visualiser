let btn = document.querySelector('input[type=submit]');
let token = document.querySelector('input[type=hidden]').getAttribute('value');
let query = document.querySelector('input[type=text]').value;

btn.addEventListener('click', (evt) => {
    evt.preventDefault();

    query = document.querySelector('input[type=text]').value;

    document.querySelectorAll('.track')
        .forEach(el => {
            document.body.removeChild(el);
        });

    fetch('http://localhost:3000/tracks?accessToken=' + token + '&q=' + query, {
        method: "GET",
        headers: {
            'Content-Type': 'application/x-www-urlencoded'
        }
    })
    .then(response => {
        response.json()
            .then(data => {
                let elems = data.map(track => {
                    let el = document.createElement('div');
                    el.setAttribute('class', 'track');
                    let audio = document.createElement('audio');
                    audio.src = track.preview_url;
                    audio.controls = true;
                    el.innerText = track.name;
                    let artist = document.createElement('span');
                    artist.setAttribute('class','track-artist');
                    artist.innerText = track.artists[0].name;
                    let img = document.createElement('img');
                    img.src = track.image.url;
                    img.setAttribute('class','track-image');
                    el.appendChild(audio);
                    el.appendChild(artist);
                    el.appendChild(img);
                    document.body.appendChild(el);
                });
                console.log(elems);
            })
            .catch(err => console.log(err));
    })
    .catch(err => console.log("Error", err))
    ;

});