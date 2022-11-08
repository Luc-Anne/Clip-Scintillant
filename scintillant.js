// Utils
function getValueCss(value, unit) {
    return parseFloat(value.substring(0, value.indexOf(unit)));
}

//Cinema
class Cinema {
    constructor() {
        if (window.innerWidth >= 2160) {
            this.pas = 6;
        } else if (window.innerWidth >= 1440) {
            this.pas = 5;
        } else if (window.innerWidth >= 1000) {
            this.pas = 4;
        }else if (window.innerWidth >= 600) {
            this.pas = 3;
        } else {
            this.pas = 2;
        }
        this.resetCinema();
    }

    resetCinema() {
        this.currentAct = -1;
        this.etoiles = [];
        this.personnages = [];
        try{
            clearInterval(this.loopEtoiles);
            clearInterval(this.loopTrajectoire);
            clearInterval(this.loopScintilleSpecialOne);
            clearInterval(this.loopMoveSpecialOne);
            clearInterval(this.loopMoveSpecialOneFinale);
            clearInterval(this.loopFinish);
        } catch (e) {}
        this.loopEtoiles = '';
        this.loopTrajectoire = '';
        this.loopScintilleSpecialOne = '';
        this.loopMoveSpecialOne = '';
        this.loopMoveSpecialOneFinale = '';
        this.loopFinish = '';
    }

    initCinema() {
        this.resetCinema();
        onStage = true;
        this.createCinema();
        this.createPersonnage();
        this.createEtoiles();
    }

    createCinema() {
        let solPosition = window.innerHeight * 0.35 + 'px';

        let main = document.createElement('main');
        main.id = 'cinema';
        document.getElementsByTagName('body')[0].appendChild(main);
        {
            let terre = document.createElement('div');
            terre.id = 'terre';
            terre.style.bottom = solPosition;
            main.appendChild(terre);

            let cielDegrade = document.createElement('div');
            cielDegrade.id = 'cielDegrade';
            cielDegrade.style.bottom = solPosition;
            main.appendChild(cielDegrade);

            let footer = document.createElement('footer');
            footer.style.height = solPosition;
            main.appendChild(footer);
        }
    }

    createEtoiles() {
        let nbEtoile = Math.max((window.innerWidth * window.innerHeight) / 10000, 80);
        for (let i = 0; i < 15 * nbEtoile / 100; i++) {
            let etoile = new Etoile(3).etoile;
            document.getElementById('cinema').appendChild(etoile);
        }
        for (let i = 0; i < 25 * nbEtoile / 100; i++) {
            let etoile = new Etoile(2).etoile;
            document.getElementById('cinema').appendChild(etoile);
        }
        for (let i = 0; i < 60 * nbEtoile / 100; i++) {
            let etoile = new Etoile(1).etoile;
            document.getElementById('cinema').appendChild(etoile);
        }
        // Special one
        let etoile = new Etoile(1).etoile;
        etoile.setAttribute('id', "specialOne");
        etoile.style.top = (Math.random() * window.innerHeight * 0.3) + 'px';
        etoile.style.zIndex = '1';
        document.getElementById('cinema').appendChild(etoile);
    }

    createPersonnage () {
        let terre = document.getElementById('terre');
        let homme = new Personnage('homme', -200).personnage;
        terre.appendChild(homme);

        let femme = new Personnage('femme', window.innerWidth + 21).personnage;
        terre.appendChild(femme);
    }

    createTitre() {
        let div = document.createElement('div');
        div.id = "titre";
        div.style.top = window.innerHeight / 3 + 'px';
        document.getElementById('cinema').appendChild(div);

        let h1 = document.createElement('h1');
        h1.innerText = 'Scintillant';
        h1.className = 'start';
        div.appendChild(h1);
    }

    start() {
        this.initCinema();
        document.getElementsByTagName('body')[0].className = 'cinemaStart';
        this.nextActe();
    }

    stopTransition() {
        clearTimeout(cinemaStopAuto);

        document.getElementsByTagName('body')[0].className = 'cinemaStop';

        this.wait(10000).then(() => {
            this.stop();
        })
    }

    stop() {
        clearTimeout(cinemaStopAuto);

        for (let personnage of this.personnages) {
            personnage.resetPersonnage();
        }
        this.resetCinema();

        document.getElementById('cinema').remove();

        startInterlude();
        stopMusicCinema();
    }

    getSpecialOne() {
        for (let etoile of this.etoiles) {
            if (etoile.etoile.id === 'specialOne') {
                return etoile;
            }
        }
    }

    wait(millisecond) {
        return new Promise(function (resolve) {
            setTimeout(() => {resolve();}, millisecond)
        })
    }

    actionDeplacerPersonnage(role, to, direction, pas) {
        for (let personnage of this.personnages) {
            if (personnage.role === role) {
                if (typeof pas === "undefined") {
                    pas = this.pas;
                }
                personnage.move(personnage, pas, to, direction);
                break;
            }
        }
    }

    nextActe() {
        this.currentAct += 1;
        switch (this.currentAct) {
            case 0: this.acte0(); break;
            case 1: this.acte1(); break;
            case 2: this.acte2(); break;
            case 3: this.acte3(); break;
            case 5: this.acte5(); break;
            case 7: this.acte7(); break;
            case 9: this.acte9(); break;
            case 10: this.acte10(); break;
            case 11: this.acte11(); break;
            case 12: this.acte12(); break;
        }
    }

    acte0() { // L'homme se déplace vers le milieu
        this.actionDeplacerPersonnage('homme', (window.innerWidth / 2) - 20, 'right');
        this.loopEtoiles = setInterval(() => {
            for (let etoile of this.etoiles) {
                if (etoile.etoile.id !== 'specialOne') {
                    etoile.anime();
                }
            }
        }, 250);
    }

    acte1() { // L'étoile filante tombe
        let specialOne = this.getSpecialOne();
        this.wait(20000).then(() => {
            // Coordonnées
            let origin = {x: specialOne.etoile.x, y: specialOne.etoile.y};
            let dest = {x: (window.innerWidth / 2) + 30, y: window.innerHeight * 0.64};

            // Mouvement
            let currentPlace = {x: origin.x, y:origin.y};
            let currentPlaceStraight = {x: origin.x, y:origin.y};
            let percentageTodo = 1;
            this.loopTrajectoire = setInterval(() => {
                if(currentPlace.y > dest.y) {
                    clearInterval(this.loopTrajectoire);
                    this.nextActe();
                }

                // Calculer currentPlace.x et currentPlace.y en fonction de currentPlaceStraight.x et currentPlace.y
                // Ligne droite
                percentageTodo = (dest.y - currentPlace.y) / (dest.y - origin.y);
                currentPlaceStraight.x = dest.x + ((origin.x - dest.x) * (percentageTodo));
                // Courber la ligne droite
                let delta = - (percentageTodo * percentageTodo) + percentageTodo;
                currentPlace.x = currentPlaceStraight.x - (delta * (origin.x - dest.x));
                // Mimer l'accélération
                currentPlace.y = currentPlace.y - ((dest.y - origin.y) * percentageTodo / 200);

                // Déplacer
                specialOne.move(currentPlace.x, currentPlace.y);

                // Changer l'apparence
                if (percentageTodo < 0.8 && percentageTodo > 0.6){
                    specialOne.etoile.src = 'assets/images/etoile/2.svg';
                }
                if (percentageTodo < 0.6){
                    specialOne.etoile.src = 'assets/images/etoile/3.svg';
                }

                currentPlace.y += Math.max(1, Math.floor(window.innerHeight / 200));

            }, 10);
        })
    }

    acte2() { // On la fait scintiller
        let etoile = this.getSpecialOne();
        etoile.nbState = 3;
        this.loopScintilleSpecialOne = setInterval(() => {
            etoile.scintille(true);
        },100)
        this.wait(3000).then(() => {
            this.nextActe()
        })
    }

    acte3() { // L'homme se rapproche de l'étoile filante et la femme se montre
        this.actionDeplacerPersonnage('homme', window.innerWidth / 2, 'right');
        this.actionDeplacerPersonnage('femme', (window.innerWidth / 1.5) + 50, 'left', this.pas + 19);
    }

    // acte4 Inutile car il faut attendre l'autre personnage qui marche

    acte5() { // La femme fuit par peur et l'homme va la chercher
        this.wait(3000).then(() => {
            this.actionDeplacerPersonnage('femme', window.innerWidth + 50, 'right', this.pas - 19);
            this.wait(2000).then(() => {
                this.actionDeplacerPersonnage('homme', window.innerWidth + 25, 'right');
            });
        })
    }

    // acte6 Inutile car il faut attendre l'autre personnage qui marche

    acte7() { // Ils reviennent tous les deux près de l'étoile filante
        this.wait(3000).then(() => {
            this.actionDeplacerPersonnage('homme', window.innerWidth / 2, 'left');
            this.actionDeplacerPersonnage('femme', (window.innerWidth / 2) + 50, 'left', this.pas + 19);
        })
    }

    // acte8 Inutile car il faut attendre l'autre personnage qui marche

    acte9() { // L'homme se rapproche de l'étoile filante
        this.wait(3000).then(() => {
            this.actionDeplacerPersonnage('homme', window.innerWidth / 2 + 25, 'right');
        })
    }

    acte10() { // L'homme accroche l'étoile filante à la boutonnière de la femme
        this.wait(3000).then(() => {
            this.actionDeplacerPersonnage('homme', window.innerWidth / 2 + 25, 'right');
            this.wait(1000).then(() => {
                let etoile = this.getSpecialOne();
                this.loopMoveSpecialOne = setInterval(() => {
                    if (getValueCss(etoile.etoile.style.top, "px") < (window.innerHeight * 0.65) - 35) {
                        clearInterval(this.loopMoveSpecialOne);
                    }
                    etoile.etoile.style.top = (getValueCss(etoile.etoile.style.top, "px") - 2) + "px";
                    etoile.etoile.style.left = (getValueCss(etoile.etoile.style.left, "px") + 1) + "px";
                }, 100);
            })
        })
    }

    acte11() { // Ils repartent ensemble
        this.wait(3000).then(() => {
            this.actionDeplacerPersonnage('homme', window.innerWidth + 25, 'right', 1);
            this.actionDeplacerPersonnage('femme', window.innerWidth + 100, 'right', 1 - 19);
            this.loopMoveSpecialOneFinale = setInterval(() => {
                let etoile = this.getSpecialOne();
                etoile.etoile.style.left = (getValueCss(etoile.etoile.style.left, "px") + 1) + "px";
            }, 100);
            this.nextActe();
        })
    }

    acte12() { // La caméra monte pour la fin
        let nbMoved = 0;
        this.loopFinish = setInterval(()=>{
            nbMoved += 1;
            // Bouger le sol et le faire disparaître dès que possible
            try {
                let terre = document.getElementById('terre');
                terre.style.bottom = (getValueCss(terre.style.bottom, "px") - 2) + "px";
                if (nbMoved > (window.innerHeight / 4)) {
                    document.getElementById('terre').remove();
                }
            } catch (e) {}
            try {
                let cielDegrade = document.getElementById('cielDegrade');
                cielDegrade.style.bottom = (getValueCss(cielDegrade.style.bottom, "px") - 2) + "px";
                if (nbMoved > (window.innerHeight / 4)) {
                    document.getElementById('cielDegrade').remove();
                }
            } catch (e) {}
            try {
                let etoile = this.getSpecialOne();
                etoile.etoile.style.top = (getValueCss(etoile.etoile.style.top, "px") + 2) + "px"
                if (getValueCss(etoile.etoile.style.top, 'px') > window.innerHeight ||
                    etoile.etoile.style.left > window.innerWidth) {
                    etoile.etoile.remove();
                }
            } catch (e) {}
            try {
                let footer = document.getElementsByTagName('footer')[0];
                footer.style.height = (getValueCss(footer.style.height, "px") - 2) + "px";
                if (getValueCss(footer.style.height, 'px') <= 2) {
                    document.getElementsByTagName('footer')[0].remove();
                }
            } catch (e) {}

            // Bouger les étoiles
            if (nbMoved < (window.innerHeight)) {
                let length = this.etoiles.length;
                for (let i = 0; i < length; i++ ) {
                    let etoile = this.etoiles[i];
                    if (etoile.etoile.id !== "specialOne") {
                        let top = getValueCss(etoile.etoile.style.top, 'px');
                        if (top > window.innerHeight - 21) {
                            etoile.etoile.remove();
                            this.etoiles.splice(i, 1);
                            // Continuer avec des valeurs à jour
                            i--;
                            length = this.etoiles.length;
                        } else {
                            etoile.etoile.style.top = (top + 1) + "px";
                        }
                    }
                }
            } else {
                clearInterval(this.loopFinish);
            }

            // Afficher titre
            nbMoved === 200 ? this.createTitre() : null;

            nbMoved === 240 ? document.getElementById('titre').firstElementChild.className = 'boucle' : null;

        }, 100, nbMoved)
    }
}

// Etoile
class Etoile {
    constructor (nbState, left, top) {
        const etoile = document.createElement('img');
        this.etoile = etoile;
        cinema.etoiles.push(this);

        etoile.src = 'assets/images/etoile/1.svg';
        etoile.setAttribute('data-state', '1');
        etoile.className = 'etoile';
        etoile.alt = '⭐';
        etoile.style.height = '20px';
        etoile.style.width = '20px';
        etoile.style.zIndex = '-5';

        if (typeof top === "undefined" || typeof left === "undefined") {
            this.placeRandomly();
        } else {
            this.etoile.style.left = left + 'px';
            this.etoile.style.top = top + 'px';
        }

        this.nbState = nbState;
    }

    placeRandomly() {
        this.etoile.style.left = (Math.random() * (window.innerWidth - 20) ) + 'px';
        this.etoile.style.top = 0.5 < Math.random() ?
            this.etoile.style.top = (Math.random() * window.innerHeight * 0.8) + 'px'
            : -(Math.random() * window.innerHeight) + 'px';
    }

    anime() {
        0.1 > Math.random() ? this.scintille(false) : null;
    }

    scintille(isSpecialOne) {
        let state = parseInt(this.etoile.getAttribute('data-state'));
        state = state < this.nbState ? state + 1 : 1;
        if (isSpecialOne) {
            if (0.25 < Math.random()) {
                state = 2;
            }
        }
        this.etoile.setAttribute('data-state', '' + state);
        this.etoile.src = 'assets/images/etoile/' + state + '.svg';
    }

    move(destX, destY) {
        this.etoile.style.left = destX + 'px';
        this.etoile.style.top = destY + 'px';
    }
}

// Personnage
class Personnage {
    constructor(role, positionDepart) {
        let img = document.createElement('img');
        this.personnage = img;
        cinema.personnages.push(this);

        img.src = 'assets/images/personnage/' + role + '.svg';
        img.setAttribute('alt', role);
        img.className = 'personnage';
        img.id = 'role' + role;
        img.style.left = positionDepart + 'px';

        this.x = positionDepart;
        this.role = role;
        this.resetPersonnage();
    }

    resetPersonnage() {
        try {
            clearInterval(this.loopMovePersonnageAction);
        } catch (e) {}
        this.loopMovePersonnageAction = '';
    }

    getPosition() {
        return this.personnage.x;
    }

    move(personnage, pas, to, direction) {
        this.loopMovePersonnageAction = setInterval(() => {
            let position = personnage.getPosition();
            let newPosition;
            if (direction === 'right') {
                if (position > to) {
                    this.stop()
                } else {
                    newPosition = position + pas;
                }
            }
            if (direction === 'left') {
                if (position < to) {
                    this.stop()
                } else {
                    newPosition = position - pas;
                }
            }
            personnage.personnage.style.left = newPosition + "px";
            personnage.x = position - pas;
        }, 100)
    }

    stop() {
        clearInterval(this.loopMovePersonnageAction);
        cinema.nextActe();
    }
}

// Interlude
function startInterlude() {
    onStage = false;

    let body = document.getElementsByTagName('body')[0];
    body.className = 'interlude';

    let container = document.createElement('div');
    container.className = 'musiques';
    container.innerHTML =
    '    <h2>Musique</h2>' +
    '    <div>' +
    '        <div>' +
    '            <img class="btn_music_play" src="assets/images/boutons/play.png" alt="Jouer la musique">' +
    '            <img class="btn_music_stop" src="assets/images/boutons/stop.png" alt="Stopper la musique">' +
    '    </div>' +
    '    <div>' +
    '        <span class="info_music_currentTime">0:00</span> / <span class="info_music_duration">0:00</span>' +
    '    </div>' +
    '    </div>' +
    '    <h2>Clip</h2>' +
    '    <div>' +
    '        <img class="btn_clip_play" src="assets/images/boutons/play.png" alt="Jouer le clip">' +
    '        <img class="btn_clip_fullscreen" src="assets/images/boutons/fullscreen.png" alt="Affichage plein écran">' +
    '    </div>'

    setTimeout(() => {
        document.getElementsByTagName('body')[0].className = 'interlude interludeStart'
    }, 2000)
    body.appendChild(container);
    positionInterlude();

    addEventMusicPlayer();
    addDatasMusicPlayer();
}

function stopInterlude() {
    document.querySelector('.musiques').remove();
}

function positionInterlude() {
    let elem = document.querySelector('.musiques');
    elem.style.marginTop = (window.innerHeight - (elem.clientHeight)) / 2 + 'px';
}

addEventListener('resize', ()=>{
    if (onStage) {
        cinema.stop();
    } else {
        positionInterlude();
    }
});

// Players
let updateCurrentTimeInterval;

function addEventMusicPlayer() {

    document.querySelector('.btn_music_play')
        .addEventListener('click', () => {
            music.paused ? musicPlayerPlay() : musicPlayerPause();
        });

    document.querySelector('.btn_music_stop')
        .addEventListener('click', () => {
            musicPlayerStop();
        });

    document.querySelector('.btn_clip_play')
        .addEventListener('click', () => {
            document.getElementsByTagName('body')[0].className = 'interlude interludeStop'
            musicPlayerStop();
            setTimeout(() => {
                stopInterlude();
                startMusicCinema();
            }, 2000)
        });

    document.querySelector('.btn_clip_fullscreen')
        .addEventListener('click', () => {
            let body = document.documentElement;
            if (document.fullscreenElement == null) {
                if (body.requestFullscreen) {
                    body.requestFullscreen();
                } else if (body.webkitRequestFullscreen) { /* Safari */
                    body.webkitRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                }
            }
        });

}

function addDatasMusicPlayer() {
    if (isNaN(music.duration)) {
        music.onloadedmetadata = () => {
            this.addDatasMusicPlayer();
        }
    } else {
        document.querySelector('.info_music_currentTime').innerText = floatToTime(music.currentTime.toString());
        document.querySelector('.info_music_duration').innerText = floatToTime(music.duration.toString());
    }
}

function musicPlayerPlay() {
    music.play();
    musicPlayerUpdateCurrentTime();
    updateCurrentTimeInterval = setInterval(()=>musicPlayerUpdateCurrentTime(), 1000);
    document.querySelector('.btn_music_play').src = "assets/images/boutons/pause.png";
}

function musicPlayerPause() {
    music.pause();
    clearInterval(updateCurrentTimeInterval);
    document.querySelector('.btn_music_play').src = "assets/images/boutons/play.png";
}

function musicPlayerStop() {
    musicPlayerPause();
    music.currentTime = 0;
    musicPlayerUpdateCurrentTime();
}

function musicPlayerUpdateCurrentTime() {
    document.querySelector('.info_music_currentTime').innerText = floatToTime(music.currentTime.toString());
}

function startMusicCinema() {
    music.play()
        .then()
        .then(()=> {
            cinema.start();
            cinemaStopAuto = setTimeout(() => {
                cinema.stopTransition();
            },164000)
        })
        .catch(() => {
            startInterlude();
        });
}

function stopMusicCinema() {
    musicPlayerStop()
}

// Utils
function floatToTime(float) {
    let minutes = Math.floor(float / 60);
    let secondes = Math.floor(float % 60);
    let zero = secondes < 10 ? '0' : '';
    return minutes + ':' + zero + secondes;
}

//
let music;
let cinema;
let cinemaStopAuto;
let onStage = false;
window.onload = () => {
    // Init
    music = new Audio('assets/musiques/scintillant.mp3');
    music.loop = false;
    cinema = new Cinema();
    // Run
    startInterlude();
}
