// Utils
function getValueCss(value, unit) {
    return parseFloat(value.substring(0, value.indexOf(unit)));
}

//Cinema
class Cinema {
    constructor() {
        this.currentAct = -1;
    }

    pas = 5;

    start() {
        document.getElementsByTagName('body')[0].className = 'cinemaStart';
        this.nextActe();
    }

    stop() {
        document.getElementsByTagName('body')[0].className = 'cinemaStop';
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
        // Personnage
        for (let personnage of personnages) {
            if (personnage.role === 'homme') {
                personnage.move(personnage, this.pas, (window.innerWidth / 2) - 20, 'right');
                break;
            }
        }
        // Etoile
        showEtoiles();
        setInterval(() => {
            for (let etoile of etoiles) {
                if (etoile.etoile.id !== 'specialOne') {
                    etoile.anime();
                }
            }
        }, 250);
    }

    acte1() { // L'étoile filante tombe
        setTimeout(() =>{
            let specialOne = document.getElementById('specialOne');
            // Coordonnées
            let originX = specialOne.x;
            let originY = specialOne.y;
            let sommetX = (window.innerWidth / 2);
            let sommetY = window.innerHeight * 0.5;
            let destX = (window.innerWidth / 2) + 30;
            let destY = window.innerHeight * 0.64;
            // Mouvement
            specialOne.style.top = destY + 'px';
            specialOne.style.left = destX + 'px';
            this.nextActe();
        }, 10000)
    }

    acte2() { // On la fait scintiller
        for (let etoile of etoiles) {
            if (etoile.etoile.id === 'specialOne') {
                etoile.nbState = 3;
                setInterval(() => {
                    etoile.scintille(true);
                },100)
                setTimeout(() => {
                    this.nextActe()
                }, 3000)
            }
        }
    }

    acte3() { // L'homme se rapproche de l'étoile filante et la femme se montre
        // Personnage
        for (let personnage of personnages) {
            if (personnage.role === 'homme') {
                personnage.move(personnage, this.pas, window.innerWidth / 2, 'right');
            }
            if (personnage.role === 'femme') {
                personnage.move(personnage, this.pas + 19, (window.innerWidth / 1.5) + 50, 'left');
            }
        }
    }

    // acte4() {} Inutile car il y a deux personnages qui bougent

    acte5() { // L'homme et la femme se rapproche l'un de l'autre
        setTimeout(() => {
            // Personnage
            for (let personnage of personnages) {
                if (personnage.role === 'femme') {
                    personnage.move(personnage, this.pas + 19, (window.innerWidth / 1.7) + 50, 'left');
                }
                setTimeout(() => {
                    if (personnage.role === 'homme') {
                        personnage.move(personnage, this.pas, (window.innerWidth / 1.7) + 25, 'right');
                    }
                },2000);
            }
        }, 3000)
    }

    // acte6() {} Inutile car il y a deux personnages qui bougent

    acte7() { // Ils reviennent tous les deux près de l'étoile filante
        setTimeout(() => {
            // Personnage
            for (let personnage of personnages) {
                if (personnage.role === 'homme') {
                    personnage.move(personnage, this.pas, window.innerWidth / 2, 'left');
                }
                if (personnage.role === 'femme') {
                    personnage.move(personnage, this.pas + 19, (window.innerWidth / 2) + 50, 'left');
                }
            }
        }, 3000)
    }

    // acte8() {} Inutile car il y a deux personnages qui bougent

    acte9() { // L'homme se rapproche de l'étoile filante
        setTimeout(() => {
            // Personnage
            for (let personnage of personnages) {
                if (personnage.role === 'homme') {
                    personnage.move(personnage, this.pas, window.innerWidth / 2 + 25, 'right');
                }
            }
        }, 1000)
    }

    moveSpecialOne;
    acte10() { // L'homme accorche l'étoile filante à la boutonnière de la femme
        setTimeout(() => {
            // Personnage
            for (let personnage of personnages) {
                if (personnage.role === 'homme') {
                    personnage.move(personnage, this.pas, window.innerWidth / 2 + 25, 'right');
                }
            }
            setTimeout( () => {
                for (let etoile of etoiles) {
                    if (etoile.etoile.id === 'specialOne') {
                        this.moveSpecialOne = setInterval(() => {
                            if (getValueCss(etoile.etoile.style.top, "px") < (window.innerHeight * 0.65) - 35) {
                                clearInterval(this.moveSpecialOne);
                            }
                            etoile.etoile.style.top = (getValueCss(etoile.etoile.style.top, "px") - 2) + "px";
                            etoile.etoile.style.left = (getValueCss(etoile.etoile.style.left, "px") + 1) + "px";
                        }, 100)
                    }
                }
            }, 1000);
        }, 3000)
    }

    acte11() { // Ils repartent ensemble
        setTimeout(() => {
            // Personnage
            for (let personnage of personnages) {
                if (personnage.role === 'homme') {
                    personnage.move(personnage, 1, window.innerWidth + 25, 'right');
                }
                if (personnage.role === 'femme') {
                    personnage.move(personnage, 1 - 19, window.innerWidth + 100, 'right');
                }
            }
            this.moveSpecialOne = setInterval(() => {
                for (let etoile of etoiles) {
                    if (etoile.etoile.id === 'specialOne') {
                        etoile.etoile.style.left = (getValueCss(etoile.etoile.style.left, "px") + 1) + "px";
                    }
                }
            }, 100);
            this.nextActe();
        }, 3000)
    }

    acte12() { // La caméra monte pour la fin
        let nbMoved = 0;
        this.moveActeA = setInterval(()=>{
            nbMoved += 1;
            // Bouger le sol
            if (nbMoved < (window.innerHeight / 2)) {
                let terre = document.getElementById('terre');
                terre.style.bottom = (getValueCss(terre.style.bottom, "px") - 2) + "px";

                let footer = document.getElementsByTagName('footer')[0];
                footer.style.height = (getValueCss(footer.style.height, "px") - 2) + "px";
            }

            // Bouger les étoiles
            if (nbMoved < (window.innerHeight)) {
                for (let etoile of etoiles) {
                    etoile.etoile.style.top = (getValueCss(etoile.etoile.style.top, "px") + 1) + "px";
                    if (etoile.etoile.id === "specialOne") {
                        etoile.etoile.style.top = (getValueCss(etoile.etoile.style.top, "px") + 1) + "px";
                    }
                }
            } else {
                clearInterval(this.moveActeA);
            }

            // Afficher titre
            if (nbMoved === 200) {
                let div = document.createElement('div');
                div.id = "titre";
                div.style.top = window.innerHeight / 3 + 'px';
                document.getElementById('cinema').appendChild(div);

                let h1 = document.createElement('h1');
                h1.innerText = 'Scintillant';
                h1.className = 'start';
                div.appendChild(h1);
            }

            if (nbMoved === 240) {
                document.getElementById('titre').firstElementChild.className = 'boucle';
            }
        }, 100, nbMoved)
    }
}

// Etoile
class Etoile {
    constructor (nbState) {
        const etoile = document.createElement('img');
        etoile.src = 'images/etoile/1.svg';
        etoile.className = 'etoile';
        etoile.alt = 'etoile';
        // Data
        etoile.setAttribute('data-state', '1');
        // Style
        if (0.5 < Math.random()) {
            etoile.style.top = (Math.random() * window.innerHeight * 0.8) + 'px';
        } else {
            etoile.style.top = -(Math.random() * window.innerHeight) + 'px';
        }
        etoile.style.left = (Math.random() * window.innerWidth ) + 'px';
        etoile.style.height = '20px';
        etoile.style.width = '20px';
        etoile.style.zIndex = '-1';
        this.etoile = etoile;
        etoiles.push(this);

        this.nbState = nbState;
    }

    anime() {
        if (0.2 > Math.random()) {
            this.scintille(false);
        }
    }

    scintille(isSpecialOne) {
        let state = parseInt(this.etoile.getAttribute('data-state'));
        state = state < this.nbState ? state + 1 : 1;
        if (isSpecialOne && state === 1) {
            if (0.25 < Math.random()) {
                state = 2;
            }
        } else if (0.25 < Math.random()) {
            state = 2;
        }
        this.etoile.setAttribute('data-state', '' + state);
        this.etoile.src = 'images/etoile/' + state + '.svg';
    }
}

function showEtoiles() {
    let nbEtoile = window.innerWidth / 15;
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

// Personnage
class Personnage {
    constructor(role, positionDepart) {
        let img = document.createElement('img');
        img.src = 'images/personnage/' + role + '.svg';
        img.setAttribute('alt', role);
        img.className = 'personnage';
        img.id = 'role' + role;
        img.style.left = positionDepart + 'px';
        this.personnage = img;
        personnages.push(this);

        this.x = positionDepart;
        this.role = role;
        this.movePersonnageAction = '';
    }

    getPosition() {
        return this.personnage.x;
    }

    move(personnage, pas, to, direction) {
        this.movePersonnageAction = setInterval(() => {
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
        clearInterval(this.movePersonnageAction);
        cinema.nextActe();
    }
}

// Clip
let cinema;
let etoiles;
let personnages;

let cinemaStopAuto;

function initClip() {
    etoiles = [];
    personnages = [];
    cinema = new Cinema();
}

function startClip() {
    console.log('Clip - start');
    initClip();

    let solPosition = window.innerHeight * 0.35 + 'px';

    // Architecture
    let main = document.createElement('main');
    main.id = 'cinema';
    document.getElementsByTagName('body')[0].appendChild(main);
    {
        let terre = document.createElement('div');
        terre.id = 'terre';
        terre.style.bottom = solPosition;
        main.appendChild(terre);
        {
            let paysage = document.createElement('div');
            paysage.className = 'paysage';
            terre.appendChild(paysage);

            let homme = new Personnage('homme', window.innerWidth / 4).personnage;
            terre.appendChild(homme);

            let femme = new Personnage('femme', window.innerWidth + 21).personnage;
            terre.appendChild(femme);
        }
        let footer = document.createElement('footer');
        footer.style.height = solPosition;
        main.appendChild(footer);
    }
    // Start
    cinema.start();
}

function stopClip() {
    console.log('Clip - stop');
    cinema.stop();
    clearTimeout(cinemaStopAuto);
    clearTimeout(cinema.moveSpecialOne);
    setTimeout(() => {
        document.getElementById('cinema').remove();
        startInterlude();
        stopMusic();
    }, 10000)
}

// Interlude
function startInterlude() {
    console.log('Interlude - start');

    let body = document.getElementsByTagName('body')[0];
    body.className = 'interlude';

    let container = document.createElement('div');
    container.id = 'playBtn';
    body.appendChild(container);

    let img = document.createElement('img');
    img.src = 'images/play.svg';
    img.style.bottom = window.innerHeight / 2 + 'px';
    img.style.left = window.innerWidth / 2 + 'px';
    container.appendChild(img);

    img.addEventListener('click', () => {
        play();
    })
}

function stopInterlude() {
    console.log('Interlude - stop');
    document.getElementById('playBtn').remove();
}

function play() {
    stopInterlude();
    startMusic();
}

// Music
let music;

function startMusic() {
    console.log('Musique - start');
    music = new Audio('musics/Scintillant.mp3');
    music.loop = false;
    music.play()
        .then()
        .then(()=> {
            startClip();
            cinemaStopAuto = setTimeout(() => {
                stopClip();
            },164000) // TODO 164000
        })
        .catch(() => {
            startInterlude();
        });
}

function stopMusic() {
    console.log('Musique - stop');
    music.pause();
    music.currentTime = 0;
}

//
window.onload = () => {
    startMusic();
}
