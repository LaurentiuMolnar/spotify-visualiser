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
                    audio.onplay = audioPlayed(audio);

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

    setTimeout(() => {
        document.querySelectorAll('audio').forEach((el) => el.addEventListener('play', (evt) => {
            let webaudio = new WebAudio();
            evt.target.pause();
            let sound = webaudio.createSound().load(evt.target.src, (sound) => {
                sound.loop(false).play();
                console.log(sound);
            });
            let world = tQuery.createWorld().boilerplate().start();
            world._tRenderer.setClearColorHex( 0x000000, world._tRenderer.getClearAlpha());

            console.log("Event", evt.target);
    
            tQuery.createAmbientLight().addTo(world).color(0x888888);
            tQuery.createDirectionalLight().addTo(world).position(+1,+1,1).color(0x88FF88);
            tQuery.createDirectionalLight().addTo(world).position(-1,-1, 1).color(0x8888FF);
    
            const nBar = 41;
            const barW = 80/nBar;
            let bars3d = [];
    
            let group3d = tQuery.createObject3D().scale(1/20).addTo(world);
            for(let i = 0; i < nBar; i++) {
                var bar3d   = tQuery.createCube(barW, 10, 5, new THREE.MeshLambertMaterial({
                    ambient : 0x888888,
                    color   : 0xFFFFFF
                }));
                bar3d.addTo(group3d).position((i-nBar/2)*barW, 0, 0);
                bars3d.push(bar3d);
            }
    
            world.loop().hook(() => {
                if(sound.isPlayable() === false) return;
                    
                var nBarHalf = Math.ceil(nBar/2)
                var histo = sound.makeHistogram(nBarHalf);
    
                bars3d.forEach((bar3d, idx) => {
                    var histoIdx =  idx < nBarHalf ? nBarHalf-1-idx : idx - nBarHalf;
                    var height = histo[histoIdx] / 256;
                    bar3d.get(0).scale.y = height * 3;
                    let hue = Math.random()+0.1;
                    bar3d.get(0).material.color.setHSL(1-hue+height*hue, 1, 0.5);
                });
    
            });
        })
    )}, 1000);

});









