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
    removePieceFromArr(place, arr) {
        let number = this.getCellNumber(place);
        arr[number] = '';
        return arr;
    }
    testIsEmpty(i, arr) {

        return arr[i] === '';
    }

    getDiagnollyUpLeft(start, numberOfMoves) {
        let numberNot = this.getBoardNumber(start);

        let numberPart = parseInt(parseInt(numberNot[1]) + numberOfMoves);
        let index = this.columns.indexOf(numberNot[0]);

        if (index >= numberOfMoves) {
            return this.getCellNumber(this.columns[index - numberOfMoves] + numberPart);
        }
        return undefined;
    }
    getDiagnollyDownLeft(start, numberOfMoves) {
        let numberNot = this.getBoardNumber(start);
        let numberPart = parseInt(parseInt(numberNot[1]) - numberOfMoves);


        let index = this.columns.indexOf(numberNot[0]);
        if (index >= numberOfMoves) {
            let res = this.getCellNumber(this.columns[index - numberOfMoves] + numberPart);
            if (res > 63) {
                return undefined;
            } else {
                return res;
            }
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
        let numberPart = parseInt(parseInt(numberNot[1]) - numberOfMoves);

        let index = this.columns.indexOf(numberNot[0]);
        if (index + numberOfMoves < this.columns.length) {
            let res = this.getCellNumber(this.columns[index + numberOfMoves] + numberPart);
            if (res > 63) {
                return undefined;
            } else {
                return res;
            }
        }
        return undefined;
    }
    getCellUp(start, numberOfMoves) {
        let res = start - 8 * numberOfMoves;
        if (res >= 0) {
            return res;
        } else {
            return undefined;
        }
    }
    getCellDown(start, numberOfMoves) {
        let res = start + 8 * numberOfMoves;
        if (res < 64) {
            return res;
        } else {
            return undefined;
        }
    }
    getCellRight(start, numberOfMoves) {
        let cellsRight = 8 - start % 8;
        if (numberOfMoves < cellsRight) {
            return start + numberOfMoves;
        }
        return undefined;
    }

    getCellLeft(start, numberOfMoves) {
        let cellsLeft = start % 8;
        if (numberOfMoves <= cellsLeft) {
            return start - numberOfMoves;
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
                this.getPawnMovesWhite(returnArr, startLocation, arr, i, 'black', '2');
                return returnArr;
            case 'Rook':
                this.getRookMoves(returnArr, arr, i, 'black');
                return returnArr;
            case 'Bishop':
                this.getBishopMoves(returnArr, arr, i, 'black');
                return returnArr;
            case 'Knight':
                this.getKnightMoves(returnArr, arr, i, 'black');
                return returnArr;
            case 'Queen':
                this.getRookMoves(returnArr, arr, i, 'black');
                this.getBishopMoves(returnArr, arr, i, 'black');
                return returnArr;
            case 'King':
                this.getKingMoves(returnArr, arr, i, 'black');
                return returnArr;
            default:
                return undefined;
            }
        }
        if (pieceClicked.color === 'black') {

            let returnArr = [];

            switch (pieceClicked.piece) {
            case 'Pawn':
                this.getPawnMovesBlack(returnArr, startLocation, arr, i, 'white', '7');
                return returnArr;
            case 'Rook':
                this.getRookMoves(returnArr, arr, i, 'white');
                return returnArr;
            case 'Knight':
                this.getKnightMoves(returnArr, arr, i, 'white');
                return returnArr;
            case 'Bishop':
                this.getBishopMoves(returnArr, arr, i, 'white');
                return returnArr;
            case 'Queen':
                this.getRookMoves(returnArr, arr, i, 'white');
                this.getBishopMoves(returnArr, arr, i, 'white');
                return returnArr;
            case 'King':
                this.getKingMoves(returnArr, arr, i, 'white');
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
    getPawnMovesBlack(returnArr, startLocation, arr, i, color, homeLocation) {
        if (this.testIsEmpty(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) - 1)), arr)) {
            returnArr.push(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) - 1)));
        }

        if (startLocation[1] === homeLocation) {
            if (this.testIsEmpty(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) - 2)), arr) &&
                this.testIsEmpty(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) - 1)), arr)) {
                returnArr.push(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) - 2)));
            }
        }

        if (this.getDiagnollyDownLeft(i, 1) && !this.testIsEmpty(this.getDiagnollyDownLeft(i, 1), arr) &&
            this.getPieceFromArr(this.getDiagnollyDownLeft(i, 1), arr).color === color) {
            returnArr.push(this.getDiagnollyDownLeft(i, 1));
        }
        if (this.getDiagnollyDownRight(i, 1) && !this.testIsEmpty(this.getDiagnollyDownRight(i, 1), arr) &&
            this.getPieceFromArr(this.getDiagnollyDownRight(i, 1), arr).color === color) {
            returnArr.push(this.getDiagnollyDownRight(i, 1));
        }

    }
    getPawnMovesWhite(returnArr, startLocation, arr, i, color, homeLocation) {
        if (this.testIsEmpty(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) + 1)), arr)) {
            returnArr.push(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) + 1)));
        }

        if (startLocation[1] === homeLocation) {
            if (this.testIsEmpty(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) + 2)), arr) &&
                this.testIsEmpty(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) + 1)), arr)) {
                returnArr.push(this.getCellNumber(startLocation[0] + parseInt(parseInt(startLocation[1]) + 2)));
            }
        }

        if (this.getDiagnollyUpLeft(i, 1) && !this.testIsEmpty(this.getDiagnollyUpLeft(i, 1), arr) &&
            this.getPieceFromArr(this.getDiagnollyUpLeft(i, 1), arr).color === color) {
            returnArr.push(this.getDiagnollyUpLeft(i, 1));
        }
        if (this.getDiagnollyUpRight(i, 1) && !this.testIsEmpty(this.getDiagnollyUpRight(i, 1), arr) &&
            this.getPieceFromArr(this.getDiagnollyUpRight(i, 1), arr).color === color) {
            returnArr.push(this.getDiagnollyUpRight(i, 1));
        }

    }
    getKingMoves(returnArr, arr, i, color) {
        let cellUp = this.getCellUp(i, 1);
        if (cellUp !== undefined && (this.testIsEmpty(cellUp, arr) ||
                (this.getPieceFromArr(cellUp, arr) && this.getPieceFromArr(cellUp, arr).color === color))) {
            returnArr.push(cellUp);
        }
        cellUp = this.getDiagnollyUpRight(i, 1);
        if (cellUp !== undefined && (this.testIsEmpty(cellUp, arr) ||
                (this.getPieceFromArr(cellUp, arr) && this.getPieceFromArr(cellUp, arr).color === color))) {
            returnArr.push(cellUp);
        }
        cellUp = this.getCellRight(i, 1);
        if (cellUp !== undefined && (this.testIsEmpty(cellUp, arr) ||
                (this.getPieceFromArr(cellUp, arr) && this.getPieceFromArr(cellUp, arr).color === color))) {
            returnArr.push(cellUp);
        }
        cellUp = this.getDiagnollyDownRight(i, 1);
        if (cellUp !== undefined && (this.testIsEmpty(cellUp, arr) ||
                (this.getPieceFromArr(cellUp, arr) && this.getPieceFromArr(cellUp, arr).color === color))) {
            returnArr.push(cellUp);
        }
        cellUp = this.getCellDown(i, 1);
        if (cellUp !== undefined && (this.testIsEmpty(cellUp, arr) ||
                (this.getPieceFromArr(cellUp, arr) && this.getPieceFromArr(cellUp, arr).color === color))) {
            returnArr.push(cellUp);
        }
        cellUp = this.getDiagnollyDownLeft(i, 1);
        if (cellUp !== undefined && (this.testIsEmpty(cellUp, arr) ||
                (this.getPieceFromArr(cellUp, arr) && this.getPieceFromArr(cellUp, arr).color === color))) {
            returnArr.push(cellUp);
        }
        cellUp = this.getCellLeft(i, 1);
        if (cellUp !== undefined && (this.testIsEmpty(cellUp, arr) ||
                (this.getPieceFromArr(cellUp, arr) && this.getPieceFromArr(cellUp, arr).color === color))) {
            returnArr.push(cellUp);
        }
        cellUp = this.getDiagnollyUpLeft(i, 1);
        if (cellUp !== undefined && (this.testIsEmpty(cellUp, arr) ||
                (this.getPieceFromArr(cellUp, arr) && this.getPieceFromArr(cellUp, arr).color === color))) {
            returnArr.push(cellUp);
        }
    }
    getRookMoves(returnArr, arr, i, color) {

        let canMoveUp = true;
        let canMoveDown = true;
        let canMoveLeft = true;
        let canMoveRight = true;
        let counter = 1;
        while (canMoveUp) {
            let cellUp = this.getCellUp(i, counter);

            console.log(cellUp);

            if (cellUp !== undefined && this.testIsEmpty(cellUp, arr)) {
                returnArr.push(cellUp);
                counter++;
            } else {
                if (cellUp !== undefined && this.getPieceFromArr(cellUp, arr).color === color) {
                    returnArr.push(cellUp);
                }
                canMoveUp = false;
            }
        }
        counter = 1;
        while (canMoveDown) {
            let cellDown = this.getCellDown(i, counter);
            if (cellDown !== undefined && this.testIsEmpty(cellDown, arr)) {
                returnArr.push(cellDown);
                counter++;
            } else {
                if (cellDown !== undefined && this.getPieceFromArr(cellDown, arr).color === color) {
                    returnArr.push(cellDown);
                }
                canMoveDown = false;
            }
        }
        counter = 1;
        while (canMoveLeft) {
            let cellLeft = this.getCellLeft(i, counter);
            if (cellLeft !== undefined && this.testIsEmpty(cellLeft, arr)) {
                returnArr.push(cellLeft);
                counter++;
            } else {
                if (cellLeft !== undefined && this.getPieceFromArr(cellLeft, arr).color === color) {
                    returnArr.push(cellLeft);
                }
                canMoveLeft = false;
            }
        }
        counter = 1;
        while (canMoveRight) {
            let cellRight = this.getCellRight(i, counter);
            if (cellRight !== undefined && this.testIsEmpty(cellRight, arr)) {
                returnArr.push(cellRight);
                counter++;
            } else {
                if (cellRight !== undefined && this.getPieceFromArr(cellRight, arr).color === color) {
                    returnArr.push(cellRight);
                }
                canMoveRight = false;
            }
        }
    }
    getKnightMoves(returnArr, arr, i, color) {
        console.log(i);

        console.log(this.getCellLeft(i, 1));

        let pos1 = this.getCellUp(this.getCellLeft(i, 1), 2);

        if (pos1 !== undefined && ((this.getPieceFromArr(pos1, arr) && this.getPieceFromArr(pos1, arr).color === color) ||
                this.testIsEmpty(pos1, arr))) {
            console.log('helloo');

            returnArr.push(pos1);
        }
        let pos2 = this.getCellUp(this.getCellRight(i, 1), 2);

        if (pos2 !== undefined && ((this.getPieceFromArr(pos2, arr) && this.getPieceFromArr(pos2, arr).color === color) ||
                this.testIsEmpty(pos2, arr))) {
            returnArr.push(pos2);
        }
        let pos3 = this.getCellUp(this.getCellLeft(i, 2), 1);

        if (pos3 !== undefined && ((this.getPieceFromArr(pos3, arr) && this.getPieceFromArr(pos3, arr).color === color) ||
                this.testIsEmpty(pos3, arr))) {
            returnArr.push(pos3);
        }
        let pos4 = this.getCellUp(this.getCellRight(i, 2), 1);

        if (pos4 !== undefined && ((this.getPieceFromArr(pos4, arr) && this.getPieceFromArr(pos4, arr).color === color) ||
                this.testIsEmpty(pos4, arr))) {
            returnArr.push(pos4);
        }
        let pos5 = this.getCellDown(this.getCellLeft(i, 1), 2);

        if (pos5 !== undefined && ((this.getPieceFromArr(pos5, arr) && this.getPieceFromArr(pos5, arr).color === color) ||
                this.testIsEmpty(pos5, arr))) {
            returnArr.push(pos5);
        }
        let pos6 = this.getCellDown(this.getCellRight(i, 1), 2);

        if (pos6 !== undefined && ((this.getPieceFromArr(pos6, arr) && this.getPieceFromArr(pos6, arr).color === color) ||
                this.testIsEmpty(pos6, arr))) {
            returnArr.push(pos6);
        }
        let pos7 = this.getCellDown(this.getCellLeft(i, 2), 1);

        if (pos7 !== undefined && ((this.getPieceFromArr(pos7, arr) && this.getPieceFromArr(pos7, arr).color === color) ||
                this.testIsEmpty(pos7, arr))) {
            returnArr.push(pos7);
        }
        let pos8 = this.getCellDown(this.getCellRight(i, 2), 1);

        if (pos8 !== undefined && ((this.getPieceFromArr(pos8, arr) && this.getPieceFromArr(pos8, arr).color === color) ||
                this.testIsEmpty(pos8, arr))) {
            returnArr.push(pos8);
        }
    }
    getBishopMoves(returnArr, arr, i, color) {

        let canMoveUpLeft = true;
        let canMoveUpRight = true;
        let canMoveDownLeft = true;
        let canMoveDownRight = true;
        let counter = 1;
        while (canMoveUpLeft) {
            let cellUp = this.getDiagnollyUpLeft(i, counter);
            if (cellUp !== undefined && this.testIsEmpty(cellUp, arr)) {
                returnArr.push(cellUp);
                counter++;
            } else {
                if (cellUp !== undefined && this.getPieceFromArr(cellUp, arr).color === color) {
                    returnArr.push(cellUp);
                }
                canMoveUpLeft = false;
            }
        }
        counter = 1;
        while (canMoveUpRight) {
            let cellDown = this.getDiagnollyUpRight(i, counter);
            if (cellDown !== undefined && this.testIsEmpty(cellDown, arr)) {
                returnArr.push(cellDown);
                counter++;
            } else {
                if (cellDown !== undefined && this.getPieceFromArr(cellDown, arr).color === color) {
                    returnArr.push(cellDown);
                }
                canMoveUpRight = false;
            }
        }
        counter = 1;
        while (canMoveDownLeft) {
            let cellLeft = this.getDiagnollyDownLeft(i, counter);
            if (cellLeft !== undefined && this.testIsEmpty(cellLeft, arr)) {
                returnArr.push(cellLeft);
                counter++;
            } else {
                if (cellLeft !== undefined && this.getPieceFromArr(cellLeft, arr).color === color) {
                    returnArr.push(cellLeft);
                }
                canMoveDownLeft = false;
            }
        }
        counter = 1;
        while (canMoveDownRight) {
            let cellRight = this.getDiagnollyDownRight(i, counter);
            if (cellRight !== undefined && this.testIsEmpty(cellRight, arr)) {
                returnArr.push(cellRight);
                counter++;
            } else {
                if (cellRight !== undefined && this.getPieceFromArr(cellRight, arr).color === color) {
                    returnArr.push(cellRight);
                }
                canMoveDownRight = false;
            }
        }
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