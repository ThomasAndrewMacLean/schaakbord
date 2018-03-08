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


    globalData.board = document.querySelector('schaak-bord');

    const socket = io(server);
    // socket.emit('test', 'hello');

    if (socket !== undefined) {

        socket.on('return-private', (data) => {
            console.log('return private');
            console.log(data);

            globalData.board.moveByNotation(data);
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
                globalData.game = x.game;
                history.pushState(null, null, '#/game/' + x.game._id);
                goToPage('gamepage');
                //socket.on('subscribe', function (room) {
                console.log('joined 123 private room');
                joinRoom(x.game._id);
            });
        }).catch(err => {
            console.log(err);
            // toastie(err);
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

    function test(data) {
        console.log(getGameNumber());

        socket.emit('private', {
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

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }

    document.getElementById('sendbtn').addEventListener('click', send);
    document.getElementById('signupbtn').addEventListener('click', signup);
    document.getElementById('deletebtn').addEventListener('click', delete_cookie);
    document.getElementById('loginbtn').addEventListener('click', login);
    document.getElementById('newgamebtn').addEventListener('click', createNewGame);
    document.getElementById('backtohomebtn').addEventListener('click', backToHomeFromGame);
    document.getElementById('backtohomebtn2').addEventListener('click', goToPage);

    document.getElementById('openbtn').addEventListener('click', goToOpenGames);

    // document.getElementById('test').addEventListener('click', test);


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
        test: test,
        joinRoom: joinRoom,
        postWithCookie: postWithCookie,
        addMsgToBoard
    };
})();



function goToGame() {
    let id = this.dataset.id;
    console.log('id: ' + id);
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

            });
            goToPage('openpage');
        });

    });


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

function toastie(err) {
    console.log('error');
    console.log(err);
    globalData.busy = false;
    err.json().then(x => {
        console.log('TOASTIE');
        console.log(x);
        const errMsg = x.err || 'Something went wrong...';

        const toaster = document.getElementById('toaster');
        toaster.innerHTML = errMsg;
        toaster.classList.add('showtoast');
        setTimeout(() => {
            const toaster = document.getElementById('toaster');
            toaster.classList.remove('showtoast');
        }, 5000);
    });
}

function logonSucces(data) {
    data.json().then(x => {
        console.log(x);

        if (x.cookie) {
            localStorage.cookie = x.cookie;
        }
        let user = x.user || document.getElementById('email').value || '';
        globalData.user = user;
        document.getElementById('user').innerHTML = user;

        let redirect;
        let gNumber = getGameNumber();
        if (gNumber === 0) {

            redirect = 'homepage';
        } else {
            iife.joinRoom(gNumber);
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
            });

            redirect = 'gamepage';
        }
        iife.postWithCookie('getMessages', {
            'hellotest': 'jowkese'
        }).then(msg => {
            msg.json().then(m => {
                console.log(m);
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
        this.t = 'xxx';
        this.pieces = {
            whiteKing: '&#9812;',
            whiteQueen: '&#9813;',
            whiteRook: '&#9814;',
            whiteBishop: '&#9815;',
            whiteKnight: '&#9816;',
            whitePawn: '&#9817;',
            blackKing: '&#9818;',
            blackQueen: '&#9819;',
            blackRook: '&#9820;',
            blackBishop: '&#9821;',
            blackKnight: '&#9822;',
            blackPawn: '&#9823;'
        };

        this.board = new Array(64).fill('');
        this.startNewGame();

    }

    // test() {
    //     console.log('testtest');

    // }

    startNewGame() {
        this.board[0] = this.pieces.blackRook;
        this.board[1] = this.pieces.blackKnight;
        this.board[2] = this.pieces.blackBishop;
        this.board[3] = this.pieces.blackQueen;
        this.board[4] = this.pieces.blackKing;
        this.board[5] = this.pieces.blackBishop;
        this.board[6] = this.pieces.blackKnight;
        this.board[7] = this.pieces.blackRook;

        this.board[8] = this.pieces.blackPawn;
        this.board[9] = this.pieces.blackPawn;
        this.board[10] = this.pieces.blackPawn;
        this.board[11] = this.pieces.blackPawn;
        this.board[12] = this.pieces.blackPawn;
        this.board[13] = this.pieces.blackPawn;
        this.board[14] = this.pieces.blackPawn;
        this.board[15] = this.pieces.blackPawn;

        this.board[48] = this.pieces.whitePawn;
        this.board[49] = this.pieces.whitePawn;
        this.board[50] = this.pieces.whitePawn;
        this.board[51] = this.pieces.whitePawn;
        this.board[52] = this.pieces.whitePawn;
        this.board[53] = this.pieces.whitePawn;
        this.board[54] = this.pieces.whitePawn;
        this.board[55] = this.pieces.whitePawn;

        this.board[56] = this.pieces.whiteRook;
        this.board[57] = this.pieces.whiteKnight;
        this.board[58] = this.pieces.whiteBishop;
        this.board[59] = this.pieces.whiteQueen;
        this.board[60] = this.pieces.whiteKing;
        this.board[61] = this.pieces.whiteBishop;
        this.board[62] = this.pieces.whiteKnight;
        this.board[63] = this.pieces.whiteRook;

        //    const sb = document.querySelector('schaak-bord');
        this.innerHTML = '';
        this.drawEmptyBoard();
        this.drawPieces(this.board);
    }

    clickCell(c, i) {
        //TODO string opbouwen: E4:E6
        console.log(this.reken.getBoardNumber(i));

        let piece = Object.keys(this.pieces).find(x => {
            return this.pieces[x].substr(2, 4).toString() === c.innerHTML.charCodeAt(0).toString();
        });
        console.log(piece);

        if (!this.selectedPiece) {
            this.selectedPiece = c;
            this.selectedPiece.classList.add('selectedCell');

            this.stringNotation = i;
        } else {
            document.querySelector('.selectedCell').classList.remove('selectedCell');
            // c.innerHTML = this.selectedPiece.innerHTML;
            // this.selectedPiece.innerHTML = '';
            this.selectedPiece = null;
            this.stringNotation += ':' + i;
            iife.test(this.stringNotation);
            this.stringNotation = '';

        }
    }

    moveByNotation(not) {
        let from = not.move.split(':')[0];
        let to = not.move.split(':')[1];

        let alles = document.querySelectorAll('.cell');

        alles[to].innerHTML = alles[from].innerHTML;
        alles[from].innerHTML = '';
        alles[from].classList.add('selectedCell');
        alles[to].classList.add('selectedCell');

        setTimeout(() => {
            alles[from].classList.remove('selectedCell');
            alles[to].classList.remove('selectedCell');
        }, 2500);

    }

    drawPieces(arr) {
        document.querySelectorAll('.cell').forEach((cell, i) => cell.innerHTML = arr[i]);
    }

    drawEmptyBoard() {

        let wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        this.appendChild(wrapper);

        this.board.forEach((cell, i) => {
            let d = document.createElement('div');
            d.classList.add('cell');
            d.addEventListener('click', (e) => this.clickCell(e.target, i));
            // cell ? d.innerHTML = cell : d.innerHTML = '';
            wrapper.appendChild(d);
        });
        let selectedPiece = null;
    }
}

customElements.define('schaak-bord', Schaakbord);