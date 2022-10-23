// Utils
function getValueCss(value, unit) {
    return parseFloat(value.substring(0, value.indexOf(unit)));
}

//Cinema
class Cinema {
    constructor() {
        this.pas = 4;
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
        let nbEtoile = window.innerWidth / 10;
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
        console.log('Cinema - start');
        this.initCinema();
        document.getElementsByTagName('body')[0].className = 'cinemaStart';
        this.nextActe();
    }

    stop() {
        console.log('Cinema - stop');
        document.getElementsByTagName('body')[0].className = 'cinemaStop';
        clearTimeout(cinemaStopAuto);

        setTimeout(() => {
            for (let personnage of this.personnages) {
                personnage.resetPersonnage();
            }
            this.resetCinema();

            document.getElementById('cinema').remove();

            startInterlude();
            stopMusic();
        }, 10000)
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
        for (let personnage of this.personnages) {
            if (personnage.role === 'homme') {
                personnage.move(personnage, this.pas, (window.innerWidth / 2) - 20, 'right');
                break;
            }
        }
        this.loopEtoiles = setInterval(() => {
            for (let etoile of this.etoiles) {
                if (etoile.etoile.id !== 'specialOne') {
                    etoile.anime();
                }
            }
        }, 250);
    }

    acte1() { // L'étoile filante tombe
        for (let etoile of this.etoiles) {
            if (etoile.etoile.id === 'specialOne') {
                let specialOne = etoile;
                setTimeout(() => {
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
                            specialOne.etoile.src = 'images/etoile/2.svg';
                        }
                        if (percentageTodo < 0.6){
                            specialOne.etoile.src = 'images/etoile/3.svg';
                        }

                        currentPlace.y += Math.max(1, Math.floor(window.innerHeight / 200));

                    }, 10);
                }, 20000)
            }
        }
    }

    acte2() { // On la fait scintiller
        for (let etoile of this.etoiles) {
            if (etoile.etoile.id === 'specialOne') {
                etoile.nbState = 3;
                this.loopScintilleSpecialOne = setInterval(() => {
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
        for (let personnage of this.personnages) {
            if (personnage.role === 'homme') {
                personnage.move(personnage, this.pas, window.innerWidth / 2, 'right');
            }
            if (personnage.role === 'femme') {
                personnage.move(personnage, this.pas + 19, (window.innerWidth / 1.5) + 50, 'left');
            }
        }
    }

    // acte4() {} Inutile car il y a deux personnages qui bougent

    acte5() { // La femme fuit par peur et l'homme va la chercher
        setTimeout(() => {
            // Personnage
            for (let personnage of this.personnages) {
                if (personnage.role === 'femme') {
                    personnage.move(personnage, this.pas - 19, window.innerWidth + 50, 'right');
                }
                setTimeout(() => {
                    if (personnage.role === 'homme') {
                        personnage.move(personnage, this.pas, window.innerWidth + 25, 'right');
                    }
                },2000);
            }
        }, 3000)
    }

    // acte6() {} Inutile car il y a deux personnages qui bougent

    acte7() { // Ils reviennent tous les deux près de l'étoile filante
        setTimeout(() => {
            // Personnage
            for (let personnage of this.personnages) {
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
            for (let personnage of this.personnages) {
                if (personnage.role === 'homme') {
                    personnage.move(personnage, this.pas, window.innerWidth / 2 + 25, 'right');
                }
            }
        }, 1000)
    }

    acte10() { // L'homme accorche l'étoile filante à la boutonnière de la femme
        setTimeout(() => {
            // Personnage
            for (let personnage of this.personnages) {
                if (personnage.role === 'homme') {
                    personnage.move(personnage, this.pas, window.innerWidth / 2 + 25, 'right');
                }
            }
            setTimeout( () => {
                for (let etoile of this.etoiles) {
                    if (etoile.etoile.id === 'specialOne') {
                        this.loopMoveSpecialOne = setInterval(() => {
                            if (getValueCss(etoile.etoile.style.top, "px") < (window.innerHeight * 0.65) - 35) {
                                clearInterval(this.loopMoveSpecialOne);
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
            for (let personnage of this.personnages) {
                if (personnage.role === 'homme') {
                    personnage.move(personnage, 1, window.innerWidth + 25, 'right');
                }
                if (personnage.role === 'femme') {
                    personnage.move(personnage, 1 - 19, window.innerWidth + 100, 'right');
                }
            }
            this.loopMoveSpecialOneFinale = setInterval(() => {
                for (let etoile of this.etoiles) {
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
        this.loopFinish = setInterval(()=>{
            nbMoved += 1;
            // Bouger le sol
            if (nbMoved < (window.innerHeight / 2)) {
                let terre = document.getElementById('terre');
                terre.style.bottom = (getValueCss(terre.style.bottom, "px") - 2) + "px";

                let cielDegrade = document.getElementById('cielDegrade');
                cielDegrade.style.bottom = (getValueCss(cielDegrade.style.bottom, "px") - 2) + "px";

                for (let etoile of this.etoiles) {
                    if (etoile.etoile.id === "specialOne") {
                        etoile.etoile.style.top = (getValueCss(etoile.etoile.style.top, "px") + 2) + "px";
                    }
                }

                let footer = document.getElementsByTagName('footer')[0];
                footer.style.height = (getValueCss(footer.style.height, "px") - 2) + "px";
            } else {
                try {
                    document.getElementById('terre').remove();
                    document.getElementById('cielDegrade').remove();
                    document.getElementById('specialOne').remove();
                    document.getElementsByTagName('footer')[0].remove();
                } catch(e) {}
            }

            // Bouger les étoiles
            if (nbMoved < (window.innerHeight)) {
                for (let etoile of this.etoiles) {
                    if (etoile.etoile.id !== "specialOne") {
                        etoile.etoile.style.top = (getValueCss(etoile.etoile.style.top, "px") + 1) + "px";
                    }
                }
            } else {
                clearInterval(this.loopFinish);
            }

            // Afficher titre
            if (nbMoved === 200) {
                this.createTitre();
            }

            if (nbMoved === 240) {
                document.getElementById('titre').firstElementChild.className = 'boucle';
            }
        }, 100, nbMoved)
    }
}

// Etoile
class Etoile {
    constructor (nbState, left, top) {
        const etoile = document.createElement('img');
        this.etoile = etoile;
        cinema.etoiles.push(this);

        etoile.src = 'images/etoile/1.svg';
        etoile.className = 'etoile';
        etoile.alt = 'etoile';
        // Data
        etoile.setAttribute('data-state', '1');
        if (typeof top === "undefined" && typeof left === "undefined") {
            this.placeRandomly();
        } else {
            this.etoile.style.left = left + 'px';
            this.etoile.style.top = top + 'px';
        }
        etoile.style.height = '20px';
        etoile.style.width = '20px';
        etoile.style.zIndex = '-1';

        this.nbState = nbState;
    }

    placeRandomly() {
        if (0.5 < Math.random()) {
            this.etoile.style.top = (Math.random() * window.innerHeight * 0.8) + 'px';
        } else {
            this.etoile.style.top = -(Math.random() * window.innerHeight) + 'px';
        }
        this.etoile.style.left = (Math.random() * window.innerWidth ) + 'px';
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

        img.src = 'images/personnage/' + role + '.svg';
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
    console.log('Interlude - start');

    let body = document.getElementsByTagName('body')[0];
    body.className = 'interlude';

    let container = document.createElement('div');
    container.id = 'playBtn';
    body.appendChild(container);

    let img = document.createElement('img');
    img.src = 'images/play.svg';
    let size = (window.innerHeight / 4);
    let positionHeight = (window.innerHeight / 2) - (size / 2);
    let positionWidth = (window.innerWidth / 2) - (size / 2);
    img.style.height = size + 'px';
    img.style.bottom = positionHeight + 'px';
    img.style.left = positionWidth + 'px';
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
            cinema.start();
            cinemaStopAuto = setTimeout(() => {
                cinema.stop();
            },164000)
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
let cinema;
let cinemaStopAuto;
window.onload = () => {
    cinema = new Cinema();
    startMusic();
}
