import '../css/styles.scss';

import {
    Reken
} from './reken';

import io from 'socket.io-client';

let server = 'https://obscure-thicket-57329.herokuapp.com';

const socket = io(server);
// socket.emit('test', 'hello');

if (socket !== undefined) {

    socket.on('return', (data) => {
        console.log(data);

    });
}



(function () {
    if (document.URL.includes('localhost')) {
        server = 'http://localhost:8080';
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }

    console.log('start!');
    const url = server + '/testLogin'; //TODO: in env steken
    fetch(url, {
        credentials: 'include',
    }).then(x => {
        x.json().then(x => console.log(x));
    });
})();


document.getElementById('sendbtn').addEventListener('click', send);

function send() {
    const msg = document.getElementById('message');
    socket.emit('test', msg.value);
    msg.value = '';
}

document.getElementById('signupbtn').addEventListener('click', signup);

document.getElementById('testbtn').addEventListener('click', test);

document.getElementById('deletebtn').addEventListener('click', delete_cookie);

function delete_cookie() {
    const url = server + '/deleteCookie';

    fetch(url, {
        credentials: 'include',
        // mode: 'no-cors'

        // Access-Control-Allow-Credentials: true
    }).then(x => {
        x.json().then(x => console.log(x));
    });
}

function test() {
    const url = server + '/testLogin';

    fetch(url, {
        credentials: 'include',
        // mode: 'no-cors'

        // Access-Control-Allow-Credentials: true
    }).then(x => {
        x.json().then(x => console.log(x));
    });
}

function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //  const url = 'https://obscure-thicket-57329.herokuapp.com/signup'; //TODO: in env steken
    const url = server + '/signup'; //TODO: in env steken

    console.log(email + '-' + password);

    fetch(url, {
        method: 'POST',
        credentials: 'include',
        //  mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `email=${email}&password=${password}`
    }).then(d => {
        if (d.status === 200) {
            logonSucces();
        } else {
            toastie(d);
        }
    });

}
document.getElementById('loginbtn').addEventListener('click', login);


function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //   const url = 'https://obscure-thicket-57329.herokuapp.com/login'; //TODO: in env steken
    const url = server + '/login'; //TODO: in env steken

    console.log(email + '-' + password);

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
            logonSucces();
        } else {
            toastie(d);
        }
    });

}

function toastie(err) {
    err.json().then(x => {
        const errMsg = x.err;
        const toaster = document.getElementById('toaster');
        toaster.innerHTML = errMsg;
        toaster.classList.add('showtoast');
        setTimeout(() => {
            const toaster = document.getElementById('toaster');
            toaster.classList.remove('showtoast');
        }, 5000);
    });
}



function logonSucces() {
    const landing = document.getElementById('landing');
    const signedIn = document.getElementById('signed-in');

    landing.style.display = 'none';
    signedIn.style.display = 'block';
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