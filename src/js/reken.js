export class Reken {
    constructor() {

        this.columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
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
    }
    getBoardNumber(i) {
        return i !== null && i >= 0 && i < 64 ? this.columns[(i % 8)] + Math.floor(9 - (i + 1) / 8) : undefined;
    }

    drawPieces(arr, wrapper) {
        let board = wrapper || document;
        board.querySelectorAll('.cell').forEach((cell, i) => cell.innerHTML = arr[i]);
    }

    getPieces() {
        return this.pieces;
    }

    getCellNumber(a1Notation) {
        if (typeof a1Notation !== 'string' || a1Notation.length !== 2) {
            return undefined;
        }
        let res = 0;
        let letter = a1Notation[0];
        res += this.columns.indexOf(letter);
        if (res < 0) {
            return undefined;
        }
        let num = parseInt(a1Notation[1]);
        if (num > 8) {
            return undefined;
        }
        res += (8 - num) * 8;
        return res;
    }

    setPieceOnBoardArr(piece, place, arr) {
        let number = this.getCellNumber(place);
        let ascii = this.pieces[piece];
        arr[number] = ascii;
        return arr;
    }

    testIsEmpty(i, arr) {

        return arr[i] === '';
    }

    getDiagnollyUpLeft(start, numberOfMoves) {
        let numberNot = this.getBoardNumber(start);
        let numberPart = parseInt(parseInt(numberNot[1]) + numberOfMoves);
        let index = this.columns.indexOf(numberNot[0]);
        if (index > numberOfMoves) {
            return this.getCellNumber(this.columns[index - numberOfMoves] + numberPart);
        }
        return undefined;
    }

    getDiagnollyDownLeft(start, numberOfMoves) {
        let numberNot = this.getBoardNumber(start);
        let numberPart = parseInt(parseInt(numberNot[1]) - numberOfMoves);
        let index = this.columns.indexOf(numberNot[0]);
        if (index > numberOfMoves) {
            return this.getCellNumber(this.columns[index - numberOfMoves] + numberPart);
        }
        return undefined;
    }

    getDiagnollyUpRight(start, numberOfMoves) {
        let numberNot = this.getBoardNumber(start);
        let numberPart = parseInt(parseInt(numberNot[1]) + numberOfMoves);

        let index = this.columns.indexOf(numberNot[0]);
        if (index + numberOfMoves < this.columns.length) {
            return this.getCellNumber(this.columns[index + numberOfMoves] + numberPart);
        }
        return undefined;
    }
    getDiagnollyDownRight(start, numberOfMoves) {
        let numberNot = this.getBoardNumber(start);
        let numberPart = parseInt(parseInt(numberNot[1]) -numberOfMoves);

        let index = this.columns.indexOf(numberNot[0]);
        if (index + numberOfMoves < this.columns.length) {
            return this.getCellNumber(this.columns[index + numberOfMoves] + numberPart);
        }
        return undefined;
    }
    setCorrectMoveClassOnBoard(moves, wrapper) {
        let board = wrapper || document;
        let cells = board.querySelectorAll('.cell');

        if (moves) {

            moves.forEach(i => cells[i].classList.add('possibleMove'));
        }
    }
    removeCorrectMoveClassOnBoard(wrapper) {
        let board = wrapper || document;
        let cells = board.querySelectorAll('.possibleMove');

        cells.forEach(c => c.classList.remove('possibleMove'));
    }

    getCorrectMoves(i, arr) {

        let startLocation = this.getBoardNumber(i);

        let pieceClicked = this.getPieceFromArr(i, arr);

        if (!pieceClicked) {
            return undefined;
        }




        //ONLY WHITE NOW...
        if (pieceClicked.color === 'white') {

            let returnArr = [];

            switch (pieceClicked.piece) {
            case 'Pawn':


                if (this.testIsEmpty(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) + 1)), arr)) {
                    returnArr.push(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) + 1)));
                }

                if (startLocation[1] === '2') {
                    if (this.testIsEmpty(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) + 2)), arr) &&
                            this.testIsEmpty(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) + 1)), arr)) {
                        returnArr.push(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) + 2)));
                    }
                }

                if (this.getDiagnollyUpLeft(i, 1) && !this.testIsEmpty(this.getDiagnollyUpLeft(i, 1), arr) &&
                        this.getPieceFromArr(this.getDiagnollyUpLeft(i, 1), arr).color === 'black') {
                    returnArr.push(this.getDiagnollyUpLeft(i, 1));
                }
                if (this.getDiagnollyUpRight(i, 1) && !this.testIsEmpty(this.getDiagnollyUpRight(i, 1), arr) &&
                        this.getPieceFromArr(this.getDiagnollyUpRight(i, 1), arr).color === 'black') {
                    returnArr.push(this.getDiagnollyUpRight(i, 1));
                }

                return returnArr;

            default:
                return undefined;
            }
        }
        if (pieceClicked.color === 'black') {

            let returnArr = [];

            switch (pieceClicked.piece) {
            case 'Pawn':


                if (this.testIsEmpty(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) - 1)), arr)) {
                    returnArr.push(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) - 1)));
                }

                if (startLocation[1] === '7') {
                    if (this.testIsEmpty(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) - 2)), arr) &&
                            this.testIsEmpty(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) - 1)), arr)) {
                        returnArr.push(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) - 2)));
                    }
                }

                if (this.getDiagnollyDownLeft(i, 1) && !this.testIsEmpty(this.getDiagnollyDownLeft(i, 1), arr) &&
                        this.getPieceFromArr(this.getDiagnollyDownLeft(i, 1), arr).color === 'white') {
                    returnArr.push(this.getDiagnollyDownLeft(i, 1));
                }
                if (this.getDiagnollyDownRight(i, 1) && !this.testIsEmpty(this.getDiagnollyDownRight(i, 1), arr) &&
                        this.getPieceFromArr(this.getDiagnollyDownRight(i, 1), arr).color === 'white') {
                    returnArr.push(this.getDiagnollyDownRight(i, 1));
                }

                return returnArr;

            default:
                return undefined;
            }
        }


    }

    getPieceFromArr(i, arr) {
        let piece = Object.keys(this.pieces).find(x => {
            return this.pieces[x].toString() === arr[i];
        });
        if (!piece) {
            return undefined;
        }
        let pieceObj = {
            'color': piece.substr(0, 5),
            'piece': piece.substr(5)
        };
        return pieceObj;
    }

    getPieceByNumber(i, wrapper) {
        let c = wrapper.querySelectorAll('.cell')[i];

        let piece = Object.keys(this.pieces).find(x => {
            return this.pieces[x].substr(2, 4).toString() === c.innerHTML.charCodeAt(0).toString();
        });
        if (!piece) {
            return undefined;
        }
        let pieceObj = {
            'color': piece.substr(0, 5),
            'piece': piece.substr(5)
        };
        return pieceObj;

    }
}