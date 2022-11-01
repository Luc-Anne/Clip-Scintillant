let audio;
let lecteur;
let updateCurrentTimeInterval;

document.querySelectorAll('span[data-clip-play]').forEach(
    (elt) => {
        elt.addEventListener('click', (event)=>{
            let iframe = document.createElement('iframe');
            let title = event.target.getAttribute('data-clip-play');
            iframe.src = title + '/' + title + '.html';
            document.getElementsByTagName('body')[0].appendChild(iframe);
            audioPause();
        });
    }
)

document.querySelectorAll('div[data-musique-lecteur]').forEach(
    (elt)=> {
        lecteur = elt;
        let musique = elt.getAttribute('data-musique-lecteur');
        audio = new Audio(musique + '/' + musique + '.mp3');
        audio.onloadedmetadata = () => {
            elt.querySelector('span[data-musique-duration]').innerText = floatToTime(audio.duration.toString());
            elt.querySelector('span[data-musique-currentTime]').innerText = floatToTime(audio.currentTime.toString());
        }
    }
);

document.querySelectorAll('span[data-musique-play]').forEach(
    (elt)=> {
        elt.addEventListener('click', (event)=> {
            if (audio.paused) {
                audioPlay();
            } else {
                audioPause();
            }
        })
    }
);

lecteur.querySelectorAll('span[data-musique-reload]').forEach(
    (elt)=> {
        elt.addEventListener('click',(event)=>{
            audioRestart();
        })
    }
);

function audioRestart() {
    audio.currentTime = 0;
    updateCurrentTime();
}

function audioPlay() {
    audio.play();
    updateCurrentTime();
    updateCurrentTimeInterval = setInterval(()=>updateCurrentTime(), 1000);
    lecteur.querySelector('span[data-musique-play]').innerText = 'Mettre en pause';
}

function audioPause() {
    audio.pause();
    clearInterval(updateCurrentTimeInterval);
    lecteur.querySelector('span[data-musique-play]').innerText = 'Jouer la musique';
}

function updateCurrentTime() {
    lecteur.querySelector('span[data-musique-currentTime]').innerText = floatToTime(audio.currentTime.toString());
}

function floatToTime(float) {
    let minutes = Math.floor(float / 60);
    let secondes = Math.floor(float % 60);
    let zero = secondes < 10 ? '0' : '';
    return minutes + ':' + zero + secondes;
}