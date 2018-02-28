import '../css/styles.scss';

import {
    Reken
} from './reken';


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