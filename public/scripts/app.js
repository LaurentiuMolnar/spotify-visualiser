let btn = document.querySelector('input[type=submit]');
let token = document.querySelector('input[type=hidden]').getAttribute('value');
let query = document.querySelector('input[type=text]').value;

const canvas = document.querySelector('canvas');

let audioPlayed = (audio) => {
    console.log(audio);
};

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
                    audio.onplay = "audioPlayed";
                    let name = document.createElement('h4');
                    name.innerText = (track.name.length > 65) ? track.name.slice(0, 60) + "..." : track.name;
                    let artist = document.createElement('span');
                    artist.setAttribute('class','track-artist');
                    artist.innerText = "by " + track.artists[0].name;
                    let img = document.createElement('img');
                    img.src = track.image.url;
                    img.setAttribute('class','track-image');
                    let wrapper = document.createElement('div');
                    wrapper.setAttribute('class', 'wrapper');
                    wrapper.appendChild(name);
                    wrapper.appendChild(artist);
                    wrapper.appendChild(audio);
                    el.appendChild(img);
                    el.appendChild(wrapper);
                    document.querySelector('#wrapper').appendChild(el);
                });
                console.log(elems);
            })
            .catch(err => console.log(err));
    })
    .catch(err => console.log("Error", err))
    ;

   // document.querySelectorAll('audio').every((v,i,a) => a[i].addEventListener('play', (evt => console.log(evt.target))));

});
