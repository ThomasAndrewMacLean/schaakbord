//@ts-check
import {
    Reken
} from '../src/js/reken';
import {
    start
} from 'repl';

let rek;
let wrapper;
let startArr;

beforeEach(() => {
    startArr = ['&#9820;',
        '&#9822;',
        '&#9821;',
        '&#9819;',
        '&#9818;',
        '&#9821;',
        '&#9822;',
        '&#9820;',
        '&#9823;',
        '&#9823;',
        '&#9823;',
        '&#9823;',
        '&#9823;',
        '&#9823;',
        '&#9823;',
        '&#9823;',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '&#9817;',
        '&#9817;',
        '&#9817;',
        '&#9817;',
        '&#9817;',
        '&#9817;',
        '&#9817;',
        '&#9817;',
        '&#9814;',
        '&#9816;',
        '&#9815;',
        '&#9813;',
        '&#9812;',
        '&#9815;',
        '&#9816;',
        '&#9814;'
    ];
    rek = new Reken();
    wrapper = document.createElement('schaak-bord');
    wrapper.classList.add('wrapper');

    new Array(64).fill('').forEach((cell, i) => {
        let d = document.createElement('div');
        d.classList.add('cell');
        //  d.addEventListener('click', (e) => wrapper.clickCell(e.target, i));
        wrapper.appendChild(d);
    });


});

test('get cells', () => {
    let cells = wrapper.querySelectorAll('.cell');
    expect(cells.length).toBe(64);
});

test('create schaakbord', () => {
    expect(typeof rek).toBe('object');
});
test('kolommen', () => {
    expect(typeof rek.columns).toBe('object');
    let t = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    expect(rek.columns).toHaveLength(8);
    expect(rek.columns).toEqual(t);
});



test('getBoardNumber 4 Nok', () => {
    expect(rek.getBoardNumber(67)).toBe(undefined);
});
test('getBoardNumber 5 Nok', () => {
    expect(rek.getBoardNumber('jk')).toBe(undefined);
});
test('getBoardNumber 6 Nok', () => {
    expect(rek.getBoardNumber(null)).toBe(undefined);
});
test('getBoardNumber 7 Nok', () => {
    expect(rek.getBoardNumber(-1)).toBe(undefined);
});
test('getBoardNumber 8 Nok', () => {
    expect(rek.getBoardNumber(undefined)).toBe(undefined);
});
test('getBoardNumber 1 ok', () => {
    expect(rek.getBoardNumber(0)).toBe('A8');
});
test('getBoardNumber 2 ok', () => {
    expect(rek.getBoardNumber(55)).toBe('H2');
});
test('getBoardNumber 3 ok', () => {
    expect(rek.getBoardNumber(63)).toBe('H1');
});


test('getNumberFrom A1 notation A8 should give 0', () => {
    expect(rek.getCellNumber('A8')).toBe(0);
});
test('getNumberFrom A1 notation H1 should give 63', () => {
    expect(rek.getCellNumber('H1')).toBe(63);
});
test('getNumberFrom A1 notation H2 should give 55', () => {
    expect(rek.getCellNumber('H2')).toBe(55);
});

test('getNumberFrom A1 notation wrong input shoud give undefined (number)', () => {
    expect(rek.getCellNumber(3)).toBe(undefined);
});
test('getNumberFrom A1 notation wrong input shoud give undefined (wrong letter)', () => {
    expect(rek.getCellNumber('R2')).toBe(undefined);
});
test('getNumberFrom A1 notation wrong input shoud give undefined (null)', () => {
    expect(rek.getCellNumber(null)).toBe(undefined);
});
test('getNumberFrom A1 notation wrong input shoud give undefined (undefined)', () => {
    expect(rek.getCellNumber(undefined)).toBe(undefined);
});
test('getNumberFrom A1 notation wrong input shoud give undefined (wrong number)', () => {
    expect(rek.getCellNumber('A9')).toBe(undefined);
});
test('getNumberFrom A1 notation wrong input shoud give undefined (wrong string)', () => {
    expect(rek.getCellNumber('13')).toBe(undefined);
});
test('getNumberFrom A1 notation wrong input shoud give undefined (wrong string)', () => {
    expect(rek.getCellNumber('1A')).toBe(undefined);
});

test('getPieces', () => {
    expect(typeof rek.getPieces()).toBe('object');
    expect(Object.keys(rek.getPieces()).length).toBe(12);
});
test('is Empty false', () => {
    expect(rek.testIsEmpty(4, startArr)).toBeFalsy;
});
test('is Empty true', () => {
    expect(rek.testIsEmpty(20, startArr)).toBeTruthy;
});
test('draw board', () => {
    rek.drawPieces(startArr, wrapper);

    expect(rek.getPieceByNumber(0, wrapper).piece).toBe('Rook');
    expect(rek.getPieceByNumber(0, wrapper).color).toBe('black');
    expect(rek.getPieceByNumber(10, wrapper).piece).toBe('Pawn');
    expect(rek.getPieceByNumber(20, wrapper)).toBe(undefined);
    expect(rek.getPieceByNumber(63, wrapper).piece).toBe('Rook');
    expect(rek.getPieceByNumber(63, wrapper).color).toBe('white');

});

test('draw board', () => {
    rek.drawPieces(startArr, wrapper);

    expect(rek.getPieceFromArr(0, startArr).piece).toBe('Rook');
    expect(rek.getPieceFromArr(0, startArr).color).toBe('black');
    expect(rek.getPieceFromArr(10, startArr).piece).toBe('Pawn');
    expect(rek.getPieceFromArr(20, startArr)).toBe(undefined);
    expect(rek.getPieceFromArr(63, startArr).piece).toBe('Rook');
    expect(rek.getPieceFromArr(63, startArr).color).toBe('white');

});



test('set queen', () => {
    rek.drawPieces(startArr, wrapper);
    rek.setPieceOnBoardArr('blackQueen', 'A6', startArr);
    rek.drawPieces(startArr, wrapper);
    expect(rek.getPieceByNumber(16, wrapper).color).toBe('black');
    expect(rek.getPieceByNumber(16, wrapper).piece).toBe('Queen');
});


test('get click empty', () => {
    rek.drawPieces(startArr, wrapper);
    let cellClicked = rek.getCellNumber('E3');

    expect(rek.getCorrectMoves(cellClicked, startArr)).toBe(undefined);

});

test('get moves pawn', () => {
    rek.drawPieces(startArr, wrapper);
    let cellClicked = rek.getCellNumber('E2');
    expect(rek.getCorrectMoves(cellClicked, startArr)).toEqual([rek.getCellNumber('E3'), rek.getCellNumber('E4')]);
});

test('get moves pawn with pawn on E4', () => {
    rek.setPieceOnBoardArr('blackPawn', 'E4', startArr);
    rek.drawPieces(startArr, wrapper);
    let cellClicked = rek.getCellNumber('E2');
    expect(rek.getCorrectMoves(cellClicked, startArr)).toEqual([rek.getCellNumber('E3')]);
});
test('get moves pawn with pawn on E3', () => {
    rek.setPieceOnBoardArr('blackPawn', 'E3', startArr);
    rek.drawPieces(startArr, wrapper);
    let cellClicked = rek.getCellNumber('E2');
    expect(rek.getCorrectMoves(cellClicked, startArr)).toEqual([]);
});
test('get moves pawn with pawn on B3', () => {
    rek.setPieceOnBoardArr('blackPawn', 'B3', startArr);
    rek.setPieceOnBoardArr('blackPawn', 'A3', startArr);

    rek.drawPieces(startArr, wrapper);
    let cellClicked = rek.getCellNumber('A2');
    expect(rek.getCorrectMoves(cellClicked, startArr)).toEqual([rek.getCellNumber('B3')]);
});
test('get moves pawn with white pawn on B3', () => {
    rek.setPieceOnBoardArr('whitePawn', 'B3', startArr);
    rek.setPieceOnBoardArr('blackPawn', 'A3', startArr);

    rek.drawPieces(startArr, wrapper);
    let cellClicked = rek.getCellNumber('A2');
    expect(rek.getCorrectMoves(cellClicked, startArr)).toEqual([]);
});