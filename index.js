const pieces = {
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
    blackPawn: '&#9823;',
};

const board = new Array(64).fill('');

const startNewGame = () => {
    board[0] = pieces.blackRook;
    board[1] = pieces.blackKnight;
    board[2] = pieces.blackBishop;
    board[3] = pieces.blackQueen;
    board[4] = pieces.blackKing;
    board[5] = pieces.blackBishop;
    board[6] = pieces.blackKnight;
    board[7] = pieces.blackRook;

    board[8] = pieces.blackPawn;
    board[9] = pieces.blackPawn;
    board[10] = pieces.blackPawn;
    board[11] = pieces.blackPawn;
    board[12] = pieces.blackPawn;
    board[13] = pieces.blackPawn;
    board[14] = pieces.blackPawn;
    board[15] = pieces.blackPawn;

    board[48] = pieces.whitePawn;
    board[49] = pieces.whitePawn;
    board[50] = pieces.whitePawn;
    board[51] = pieces.whitePawn;
    board[52] = pieces.whitePawn;
    board[53] = pieces.whitePawn;
    board[54] = pieces.whitePawn;
    board[55] = pieces.whitePawn;

    board[56] = pieces.whiteRook;
    board[57] = pieces.whiteKnight;
    board[58] = pieces.whiteBishop;
    board[59] = pieces.whiteQueen;
    board[60] = pieces.whiteKing;
    board[61] = pieces.whiteBishop;
    board[62] = pieces.whiteKnight;
    board[63] = pieces.whiteRook;

    const sb = document.querySelector('schaak-bord');
    sb.innerHTML = '';
    sb.clearBoard();
};

(function () {

    console.log('start iiffee');
})();


class Schaakbord extends HTMLElement {

    constructor() {
        super();
        startNewGame();

    }


    clickCell(c) {
        if (!this.selectedPiece) {
            this.selectedPiece = c;
        } else {
            c.innerHTML = this.selectedPiece.innerHTML;
            this.selectedPiece.innerHTML = '';
            this.selectedPiece = null;
        }
    }
    clearBoard() {
        let wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');
        this.appendChild(wrapper);

        board.forEach(cell => {
            let d = document.createElement('div');
            d.classList.add('cell');
            d.addEventListener('click', (e) => this.clickCell(e.target));
            cell ? d.innerHTML = cell : d.innerHTML = '';
            wrapper.appendChild(d);
        });
        let selectedPiece = null;
    }
}


customElements.define('schaak-bord', Schaakbord);