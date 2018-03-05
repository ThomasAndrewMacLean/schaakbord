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

(function () {
    console.log('start! screen (w x h): ' + screen.width + 'x' + screen.height);
    if (document.URL.includes('localhost')) {
        server = 'http://localhost:8080';
    }

    const socket = io(server);
    // socket.emit('test', 'hello');

    if (socket !== undefined) {

        socket.on('return', (data) => {
            console.log(data);

            const msgBrd = document.getElementById('msg-brd');

            let msgwrap = document.createElement('span');
            msgwrap.classList.add('msg');
            data.user === globalData.user ? msgwrap.classList.add('my-msg') : msgwrap.classList.add('other-msg');

            msgwrap.innerHTML = `<div class="msg-user">${data.user}</div> ${data.msg}`;
            msgBrd.appendChild(msgwrap);
            updateScroll();

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
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }

    document.getElementById('sendbtn').addEventListener('click', send);
    document.getElementById('signupbtn').addEventListener('click', signup);
    document.getElementById('deletebtn').addEventListener('click', delete_cookie);
    document.getElementById('loginbtn').addEventListener('click', login);
    document.getElementById('newgamebtn').addEventListener('click', goToPage);
    document.getElementById('backtohomebtn').addEventListener('click', goToPage);


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
})();

function goToPage(newPageId) {
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
    }, 1000);
}

function delete_cookie() {
    if (globalData.busy) {
        return;
    }
    globalData.busy = true;
    const url = server + '/deleteCookie';

    fetch(url, {
        credentials: 'include',
    }).then(x => {
        localStorage.cookie = '';
        goToPage('landing');
        setTimeout(() => globalData.busy = false, 1000);

    });
}

function signup(e) {
    e.preventDefault();
    if (globalData.busy) {
        return;
    }
    globalData.busy = true;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const url = server + '/signup';

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

function login(e) {
    console.log('login');
    e.preventDefault();

    if (globalData.busy) {
        return;
    }
    globalData.busy = true;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //   const url = 'https://obscure-thicket-57329.herokuapp.com/login'; //TODO: in env steken
    const url = server + '/login'; //TODO: in env steken

    //  console.log(email + '-' + password);

    fetch(url, {
        method: 'POST',
        // mode: 'no-cors',
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
        setTimeout(() => globalData.busy = false, 1000);

        // globalData.busy = false;
        goToPage('homepage');
    });
}


export class Schaakbord extends HTMLElement {

    constructor() {
        super();
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

        console.log(this.reken.getBoardNumber(i));


        let piece = Object.keys(this.pieces).find(x => {
            return this.pieces[x].substr(2, 4).toString() === c.innerHTML.charCodeAt(0).toString();
        });
        console.log(piece);

        if (!this.selectedPiece) {
            this.selectedPiece = c;
        } else {
            c.innerHTML = this.selectedPiece.innerHTML;
            this.selectedPiece.innerHTML = '';
            this.selectedPiece = null;
        }
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