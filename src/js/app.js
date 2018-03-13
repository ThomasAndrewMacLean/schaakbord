import '../css/styles.scss';

import {
    Reken
} from './reken';

import io from 'socket.io-client';


let server = 'https://obscure-thicket-57329.herokuapp.com';



let globalData = {};

function updateScroll() {
    var element = document.getElementById('msg-brd');
    element.scrollTop = element.scrollHeight;
}

const iife = (function () {
    console.log('start! screen (w x h): ' + screen.width + 'x' + screen.height);
    if (document.URL.includes('localhost')) {
        server = 'http://localhost:8080';
    }

    document.querySelectorAll('.btn').forEach(element => {

        element.onmousedown = (e) => {
            const x = e.pageX - e.target.offsetLeft;
            const y = e.pageY - e.target.offsetTop;

            e.target.style.setProperty('--x', `${ x }px`);
            e.target.style.setProperty('--y', `${ y }px`);
        };

        element.addEventListener('transitionend', (e) => {
            console.log('end');
            console.log(e);
            if (e.propertyName === 'height') {
                e.target.style.setProperty('--size', '0px');
            }
        }, false);

    });
    globalData.board = document.querySelector('schaak-bord');

    const socket = io(server);

    if (socket !== undefined) {

        socket.on('return-private', (data) => {
            // console.log('return private');
            // console.log(data);

            if (data.gameId === getGameNumber()) {

                globalData.board.moveByNotation(data);
            } else {
                toastieFromString('new move in game: ' + data.opponent, 'info');
            }
        });

        socket.on('return', (data) => {
            console.log(data);
            const msgBrd = document.getElementById('msg-brd');

            addMsgToBoard(msgBrd, data);
            updateScroll();

        });
    }

    function addMsgToBoard(msgBoard, data) {
        let msgwrap = document.createElement('span');
        msgwrap.classList.add('msg');
        data.user === globalData.user ? msgwrap.classList.add('my-msg') : msgwrap.classList.add('other-msg');

        msgwrap.innerHTML = `<div class="msg-user">${data.user}</div>
        <div class="msg-msg">${data.message}</div>
        <div class="msg-user">${data.createdAt}</div>`;
        msgBoard.appendChild(msgwrap);
    }

    function createNewGame() {

        let url = server + '/newGame';
        let cookie = localStorage.getItem('cookie');

        fetch(url, {

            method: 'POST',
            // credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cookie: cookie
            }),
        }).then(newGameId => {
            newGameId.json().then(x => {
                console.log(x);
                setUpBoard(x.game);



                history.pushState(null, null, '#/game/' + x.game._id);
                const secondPlayer = document.getElementById('secondplayer');

                goToPage('gamepage');
            });
        }).catch(err => {
            console.log(err);
        });

    }


    function joinRoom(room) {
        socket.emit('subscribe', {
            room: room
        });
    }

    function send(e) {
        e.preventDefault();
        const msg = document.getElementById('message');
        if (msg.value) {
            socket.emit('send-msg', {
                'msg': msg.value,
                'cookie': localStorage.getItem('cookie')
            });
            msg.value = '';
        }
    }

    function sendMove(data) {
        socket.emit('sendMove', {
            'room': getGameNumber(),
            'data': data
        });
    }

    function postWithCookie(url, options) {
        return fetch(server + '/' + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

                cookie: localStorage.getItem('cookie'),
                options,
            }),
        });
    }

    if ('serviceWorker' in navigator && !document.URL.includes('localhost')) {
        navigator.serviceWorker.register('service-worker.js');
    }

    document.getElementById('sendbtn').addEventListener('click', send);
    document.getElementById('signupbtn').addEventListener('click', signup);
    document.getElementById('deletebtn').addEventListener('click', delete_cookie);
    document.getElementById('loginbtn').addEventListener('click', login);
    document.getElementById('newgamebtn').addEventListener('click', createNewGame);
    document.getElementById('backtohomebtn').addEventListener('click', backToHomeFromGame);
    document.getElementById('backtohomebtn2').addEventListener('click', goToPage);
    document.getElementById('whatsappshare').addEventListener('click', whatsappshare);

    document.getElementById('openbtn').addEventListener('click', goToOpenGames);

    let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const url = server + '/testLogin';

    if (iOS) {
        let cookie = localStorage.getItem('cookie');
        fetch(url + 'IOS', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cookie: cookie
            }),
        }).then(x => {
            console.log(x);
            logonSucces(x);
        });
    } else {
        fetch(url, {
            credentials: 'include',
        }).then(x => {
            logonSucces(x);
        });
    }

    return {
        sendMove: sendMove,
        joinRoom: joinRoom,
        postWithCookie: postWithCookie,
        addMsgToBoard
    };
})();

function whatsappshare() {


    // <a href="whatsapp://send?text=spel spelen?: https://schaakbordapp.firebaseapp.com/">whatsApp</a>

    let aLink = document.createElement('a');
    aLink.href = 'whatsapp://send?text=spel spelen?: https://schaakbordapp.firebaseapp.com/%23/game/' + getGameNumber();
    aLink.click();

}

function goToGame() {
    let id = this.dataset.id;

    let url = server + '/addPlayer';
    let cookie = localStorage.getItem('cookie');
    fetch(url, {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cookie: cookie,
            gameId: id
        }),
    }).then(g => {
        g.json().then(game => {
            console.log('game');
            console.log(game);

            setUpBoard(game);

            history.pushState(null, null, '#/game/' + id);
            goToPage('gamepage');
        });
    });
}

function goToOpenGames() {

    fetch(server + '/getOpenGames', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cookie: localStorage.getItem('cookie'),
        }),
    }).then(x => {
        x.json().then(j => {
            console.log(j);
            let listdiv = document.getElementById('openGameList');
            let innerHTML = '';
            j.forEach(g => {
                innerHTML += `<button data-id="${g._id}" class="btn btn-small btn-click-open">${g.playerWhite} - ${g.playerBlack}</button>`;
            });
            listdiv.innerHTML = innerHTML;
            document.querySelectorAll('.btn-click-open').forEach(dd => {
                dd.addEventListener('click', goToGame);
                dd.onmousedown = (e) => {
                    const x = e.pageX - e.target.offsetLeft;
                    const y = e.pageY - e.target.offsetTop;

                    e.target.style.setProperty('--x', `${ x }px`);
                    e.target.style.setProperty('--y', `${ y }px`);
                };

                dd.addEventListener('transitionend', (e) => {
                    console.log('end');
                    console.log(e);
                    if (e.propertyName === 'height') {
                        e.target.style.setProperty('--size', '0px');
                    }
                }, false);

            });

        });

    });
    goToPage('openpage');

}

function backToHomeFromGame() {
    history.pushState(null, null, '#/');

    goToPage('homepage');
}

function goToPage(newPageId) {
    if (globalData.busy) {
        return;
    }
    globalData.busy = true;
    if (typeof newPageId !== 'string') {
        newPageId = this.dataset.link;
    }
    const oldPage = document.querySelector('.show-hide-div:not(.hide-div)');
    const newPage = document.getElementById(newPageId);


    newPage.style.left = '-100%';
    newPage.classList.remove('hide-div');
    newPage.classList.add('show-div');

    oldPage.classList.add('hide-div');
    oldPage.classList.add('show-leave-div');
    oldPage.classList.remove('show-div');
    oldPage.style.left = '100%';

    setTimeout(() => {
        const oldPage = document.querySelector('.show-leave-div');
        oldPage.classList.remove('show-leave-div');
        oldPage.style.left = '-100px';
        globalData.busy = false;
    }, 1000);
}

function delete_cookie() {
    // if (globalData.busy) {
    //     return;
    // }
    // globalData.busy = true;
    const url = server + '/deleteCookie';

    fetch(url, {
        credentials: 'include',
    }).then(x => {
        localStorage.cookie = '';
        goToPage('landing');
        // setTimeout(() => globalData.busy = false, 1000);

    });
}

function signup(e) {
    loginSignUp(e, '/signup');
}

function login(e) {
    loginSignUp(e, '/login');
}

function loginSignUp(e, urlRoute) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        return;
    }

    const url = server + urlRoute;

    fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `email=${email}&password=${password}`
    }).then(d => {
        if (d.status === 200) {
            logonSucces(d);
        } else {
            toastie(d);
        }
    });
}

function getGameNumber() {
    const url = document.URL;
    if (url.includes('/game/')) {
        return url.split('/game/')[1];
    } else {
        return 0;
    }
}

function toastieFromString(text, typeClass) {
    const toaster = document.getElementById('toaster');
    toaster.innerHTML = text;
    toaster.classList.add(typeClass);

    toaster.classList.add('showtoast');
    setTimeout(() => {
        const toaster = document.getElementById('toaster');
        toaster.classList.remove('showtoast');
        toaster.classList.remove(typeClass);
        toaster.innerHTML = '';
    }, 5000);
}

function toastie(err) {
    console.log('error');
    console.log(err);
    globalData.busy = false;
    err.json().then(x => {
        console.log('TOASTIE');
        console.log(x);
        const errMsg = x.err || 'Something went wrong...';

        toastieFromString(errMsg, 'error');
    });
}

function setUpBoard(game) {
    let players = [game.playerBlack, game.playerWhite];

    globalData.board.playerBlack = game.playerBlack;
    globalData.board.playerWhite = game.playerWhite;
    globalData.board.playerToPlay = players[game.moves.length % 2];
    globalData.board.board = game.moves.slice(-1).pop();
    globalData.board.reken.drawPieces(game.moves.slice(-1).pop());

    if (globalData.user === game.playerBlack) {
        document.querySelector('.wrapper').style.setProperty('--rotateblack', '180deg');
    } else {
        document.querySelector('.wrapper').style.setProperty('--rotateblack', '0deg');
    }
}

function logonSucces(data) {
    console.log(data);

    data.json().then(x => {
        console.log('succes');

        console.log(x);

        if (x.cookie) {
            localStorage.cookie = x.cookie;
        }
        let user = x.user || document.getElementById('email').value || '';
        globalData.user = user;
        iife.joinRoom(user);

        document.getElementById('user').innerHTML = user;

        let redirect;
        let gNumber = getGameNumber();
        if (gNumber === 0) {

            redirect = 'homepage';
        } else {
            //  iife.joinRoom(gNumber);
            let url = server + '/addPlayer';
            let cookie = localStorage.getItem('cookie');
            fetch(url, {

                method: 'POST',
                // credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cookie: cookie,
                    gameId: gNumber
                }),
            }).then(g => {
                g.json().then(game => {
                    console.log('game');
                    console.log(game);

                    setUpBoard(game);

                });
            });

            redirect = 'gamepage';
        }
        iife.postWithCookie('getMessages', {
            'hellotest': 'jowkese'
        }).then(msg => {
            msg.json().then(m => {

                const msgBrd = document.getElementById('msg-brd');
                msgBrd.innerHTML = '';
                m.reverse().forEach(mm => iife.addMsgToBoard(msgBrd, mm));

                updateScroll();

            });
        });

        // get gameData?
        goToPage(redirect);



    });
}


export class Schaakbord extends HTMLElement {

    constructor() {
        super();
        // get gameData?
        console.log('CONSTR');
        this.reken = new Reken();
        this.board = new Array(64).fill('');
        this.drawEmptyBoard();

        this.pieces = this.reken.getPieces();


    }



    clickCell(c, i) {


        // console.log(this.reken.getBoardNumber(i));
        //console.log(c.innerHTML.charCodeAt(0).toString());

        let piece = Object.keys(this.pieces).find(x => {
            return this.pieces[x].substr(2, 4).toString() === c.innerHTML.charCodeAt(0).toString();
        });

        let pieceColor = piece && piece.substr(0, 5) || '';



        if (globalData.user !== this.playerToPlay) {
            console.log(`not your turn ${globalData.user}, ${this.playerToPlay} has to play first...`);
            return;
        }

        let colorToPlay = this.playerToPlay === this.playerWhite ? 'white' : 'black';

        if (!this.selectedPiece) {

            if (piece == undefined || !piece.includes(colorToPlay)) {
                console.log('empty cell');
                return;
            }

            let moves = this.reken.getCorrectMoves(i, this.board);
            //  this.reken.removeCorrectMoveClassOnBoard();
            this.reken.setCorrectMoveClassOnBoard(moves);
            this.selectedPiece = c;
            this.selectedPiece.classList.add('selectedCell');

            this.stringNotation = i;
        } else {

            if (this.stringNotation == i) {
                console.log('same place');
                document.querySelector('.selectedCell').classList.remove('selectedCell');
                this.selectedPiece = null;
                this.stringNotation = '';
                this.reken.removeCorrectMoveClassOnBoard();
                return;
            }
            if (piece && piece.includes(colorToPlay)) {
                console.log('same color');
                document.querySelector('.selectedCell').classList.remove('selectedCell');
                this.reken.removeCorrectMoveClassOnBoard();
                let moves = this.reken.getCorrectMoves(i, this.board);
                this.reken.setCorrectMoveClassOnBoard(moves);
                this.selectedPiece = c;
                this.selectedPiece.classList.add('selectedCell');

                this.stringNotation = i;
                return;
            }

            if (!c.classList.contains('possibleMove')) {
                console.log('not valid');

                return;
            }

            document.querySelector('.selectedCell').classList.remove('selectedCell');






            this.stringNotation += ':' + i;
            this.addFakePieceToAnimate(this.stringNotation, false);
            iife.sendMove(this.stringNotation);
            this.reken.removeCorrectMoveClassOnBoard();
            this.selectedPiece = null;
            this.stringNotation = '';
        }
    }

    addFakePieceToAnimate(stringNotation, isAfterServer) {
        let from = stringNotation.split(':')[0];
        let to = stringNotation.split(':')[1];
        //TODO animatie in gang zetten voor request naar server...


        let piece = this.board[from];
        if (isAfterServer) {
            piece = this.board[to];
        }
        console.log(piece);
        let div = document.createElement('div');
        div.classList.add('piece');
        div.innerHTML = piece;
        div.left = 0;
        div.bottom = 0;
        let cellHeight = document.querySelector('.cell').clientHeight;

        let kol = (from % 8);
        let rij = Math.floor(from / 8);

        if (this.playerBlack === globalData.user) {
            kol = 7 - kol;
            rij = 7 - rij;
        }

        let start = (-3.5 * cellHeight) + (kol * cellHeight);
        let startRij = (-3.5 * cellHeight) + (rij * cellHeight);

        div.style.transform = `translate(${start}px, ${startRij}px)`;

        this.cells[from].innerHTML = '';
        this.appendChild(div).focus();

        let kolEind = (to % 8);
        let rijEind = Math.floor(to / 8);

        if (this.playerBlack === globalData.user) {
            kolEind = 7 - kolEind;
            rijEind = 7 - rijEind;
        }
        let startEind = (-3.5 * cellHeight) + (kolEind * cellHeight);
        let startRijEind = (-3.5 * cellHeight) + (rijEind * cellHeight);

        div.style.transform = `translate(${startEind}px, ${startRijEind}px)`;
    }
    moveByNotation(not) {
        console.log(not);
        this.board = not.board;
        this.playerToPlay = not.nextPlayer;

        if (!document.querySelector('.piece')) {
            console.log('other player');
            this.addFakePieceToAnimate(not.move, true);
        }
        document.querySelector('.piece').addEventListener('transitionend', () => {
            this.removeChild(document.querySelector('.piece'));
            this.reken.drawPieces(not.board);
        });
        // let from = not.move.split(':')[0];
        // let to = not.move.split(':')[1];
        // //TODO animatie in gang zetten voor request naar server...
        // this.cells[from].innerHTML = '';

        // let piece = this.board[to];
        // console.log(piece);

        // let div = document.createElement('div');
        // div.classList.add('piece');
        // div.innerHTML = piece;
        // div.left = 0;
        // div.bottom = 0;
        // let cellHeight = document.querySelector('.cell').clientHeight;
        // console.log('cellHeight ' + cellHeight);

        // let kol = (from % 8);
        // let rij = Math.floor(from / 8);

        // if (this.playerBlack === globalData.user) {
        //     kol = 7 - kol;
        //     rij = 7 - rij;
        // }

        // let start = (-3.5 * cellHeight) + (kol * cellHeight);
        // let startRij = (-3.5 * cellHeight) + (rij * cellHeight);

        // div.style.transform = `translate(${start}px, ${startRij}px)`;

        // this.appendChild(div).focus();

        // let kolEind = (to % 8);
        // let rijEind = Math.floor(to / 8);

        // if (this.playerBlack === globalData.user) {
        //     kolEind = 7 - kolEind;
        //     rijEind = 7 - rijEind;
        // }
        // let startEind = (-3.5 * cellHeight) + (kolEind * cellHeight);
        // let startRijEind = (-3.5 * cellHeight) + (rijEind * cellHeight);

        // div.style.transform = `translate(${startEind}px, ${startRijEind}px)`;
        //   div.addEventListener('transitionend', () => {

        //  });
    }


    drawEmptyBoard() {
        let wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        this.appendChild(wrapper);

        this.board.forEach((cell, i) => {
            let d = document.createElement('div');
            d.classList.add('cell');
            d.addEventListener('click', (e) => this.clickCell(e.target, i));
            wrapper.appendChild(d);
        });
        let selectedPiece = null;

        this.cells = this.querySelectorAll('.cell');
    }
}

customElements.define('schaak-bord', Schaakbord);