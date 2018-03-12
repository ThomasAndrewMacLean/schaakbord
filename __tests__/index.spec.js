//@ts-check
import {
    Reken
} from '../src/js/reken';


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
test('get moves pawn', () => {
    rek.drawPieces(startArr, wrapper);
    let cellClicked = rek.getCellNumber('E7');
    expect(rek.getCorrectMoves(cellClicked, startArr)).toEqual([rek.getCellNumber('E6'), rek.getCellNumber('E5')]);
});
test('get moves pawn', () => {
    rek.setPieceOnBoardArr('whiteQueen', 'F6', startArr);
    rek.drawPieces(startArr, wrapper);
    let cellClicked = rek.getCellNumber('E7');
    expect(rek.getCorrectMoves(cellClicked, startArr).sort())
        .toEqual([rek.getCellNumber('E6'), rek.getCellNumber('F6'), rek.getCellNumber('E5')].sort());
});
test('get moves pawn', () => {
    rek.setPieceOnBoardArr('whiteQueen', 'A6', startArr);
    rek.setPieceOnBoardArr('whiteQueen', 'B6', startArr);

    rek.drawPieces(startArr, wrapper);
    let cellClicked = rek.getCellNumber('A7');
    expect(rek.getCorrectMoves(cellClicked, startArr).sort())
        .toEqual([rek.getCellNumber('B6')].sort());
});
test('get moves pawn', () => {
    rek.setPieceOnBoardArr('whiteQueen', 'A6', startArr);
    rek.setPieceOnBoardArr('blackPawn', 'B6', startArr);

    rek.drawPieces(startArr, wrapper);
    let cellClicked = rek.getCellNumber('A7');
    expect(rek.getCorrectMoves(cellClicked, startArr).sort())
        .toEqual([].sort());
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
it('get moves pawn with white pawn on B3', () => {
    rek.setPieceOnBoardArr('whitePawn', 'B3', startArr);
    rek.setPieceOnBoardArr('blackPawn', 'A3', startArr);

    rek.drawPieces(startArr, wrapper);
    let cellClicked = rek.getCellNumber('A2');
    expect(rek.getCorrectMoves(cellClicked, startArr)).toEqual([]);
});


it('moves set class on wrapper', () => {
    let moves = [1, 21, 62];
    let cells = wrapper.querySelectorAll('.cell');
    expect(cells[1].classList.contains('possibleMove')).toBe(false);
    expect(cells[21].classList.contains('possibleMove')).toBe(false);

    rek.setCorrectMoveClassOnBoard(moves, wrapper);
    expect(cells[1].classList.contains('possibleMove')).toBe(true);
    expect(cells[22].classList.contains('possibleMove')).toBe(false);
});


it('removes class', () => {
    let moves = [1, 21, 62];
    let cells = wrapper.querySelectorAll('.cell');
    rek.setCorrectMoveClassOnBoard(moves, wrapper);
    expect(cells[1].classList.contains('possibleMove')).toBe(true);
    expect(cells[22].classList.contains('possibleMove')).toBe(false);
    rek.removeCorrectMoveClassOnBoard(wrapper);
    expect(cells[1].classList.contains('possibleMove')).toBe(false);
    expect(cells[22].classList.contains('possibleMove')).toBe(false);
});

describe('diag up', () => {

    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpLeft(0, 1)).toBeUndefined;
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpLeft(17, 1)).toBe(8);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpLeft(17, 2)).toBe(undefined);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpLeft(18, 2)).toBe(0);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpLeft(16, 1)).toBe(undefined);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpLeft(6, 1)).toBe(undefined);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpLeft(8, 1)).toBe(undefined);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpLeft(9, 1)).toBe(0);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpLeft(63, 1)).toBe(63 - 8 - 1);
    });

    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpRight(0, 1)).toBeUndefined;
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpRight(17, 1)).toBe(10);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpRight(17, 2)).toBe(3);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpRight(18, 2)).toBe(4);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpRight(16, 1)).toBe(9);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpRight(6, 1)).toBe(undefined);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpRight(8, 1)).toBe(1);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpRight(9, 1)).toBe(2);
    });
    it('tests diagnolly up', () => {
        expect(rek.getDiagnollyUpRight(63, 1)).toBe(undefined);
    });
});

describe('diag down', () => {

    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownLeft(0, 1)).toBeUndefined;
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownLeft(rek.getCellNumber('A6'), 1))
            .toBe(undefined);
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownLeft(rek.getCellNumber('B6'), 1))
            .toBe(rek.getCellNumber('A5'));
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownLeft(rek.getCellNumber('B6'), 2))
            .toBe(undefined);
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownLeft(rek.getCellNumber('C6'), 2))
            .toBe(rek.getCellNumber('A4'));
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownLeft(rek.getCellNumber('B1'), 1))
            .toBe(undefined);
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownLeft(rek.getCellNumber('C1'), 1))
            .toBe(undefined);
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownLeft(rek.getCellNumber('H3'), 1))
            .toBe(rek.getCellNumber('G2'));
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownLeft(rek.getCellNumber('E6'), 3))
            .toBe(rek.getCellNumber('B3'));
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownLeft(rek.getCellNumber('H8'), 1))
            .toBe(rek.getCellNumber('G7'));
    });



    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownRight(0, 1)).toBe(rek.getCellNumber('B7'));
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownRight(rek.getCellNumber('A6'), 1))
            .toBe(rek.getCellNumber('B5'));
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownRight(rek.getCellNumber('B6'), 1))
            .toBe(rek.getCellNumber('C5'));
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownRight(rek.getCellNumber('B6'), 2))
            .toBe(rek.getCellNumber('D4'));
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownRight(rek.getCellNumber('C6'), 2))
            .toBe(rek.getCellNumber('E4'));
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownRight(rek.getCellNumber('B1'), 1))
            .toBe(undefined);
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownRight(rek.getCellNumber('C1'), 1))
            .toBe(undefined);
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownRight(rek.getCellNumber('H3'), 1))
            .toBe(undefined);
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownRight(rek.getCellNumber('E6'), 3))
            .toBe(rek.getCellNumber('H3'));
    });
    it('tests diagnolly down', () => {
        expect(rek.getDiagnollyDownRight(rek.getCellNumber('A8'), 1))
            .toBe(rek.getCellNumber('B7'));
    });

});
describe('cell down', () => {
    it('tests cell down', () => {
        expect(rek.getCellDown(rek.getCellNumber('A8'), 1))
            .toBe(rek.getCellNumber('A7'));
    });
    it('tests cell down', () => {
        expect(rek.getCellDown(rek.getCellNumber('A1'), 1))
            .toBe(undefined);
    });
    it('tests cell down', () => {
        expect(rek.getCellDown(rek.getCellNumber('E6'), 1))
            .toBe(rek.getCellNumber('E5'));
    });

});
describe('cell up', () => {
    it('tests cell up', () => {
        expect(rek.getCellUp(rek.getCellNumber('A8'), 1))
            .toBe(undefined);
    });
    it('tests cell up', () => {
        expect(rek.getCellUp(rek.getCellNumber('A7'), 1))
            .toBe(rek.getCellNumber('A8'));
    });
    it('tests cell up', () => {
        expect(rek.getCellUp(rek.getCellNumber('C6'), 1))
            .toBe(rek.getCellNumber('C7'));
    });
    it('tests cell up', () => {
        expect(rek.getCellUp(rek.getCellNumber('H1'), 1))
            .toBe(rek.getCellNumber('H2'));
    });
    it('tests cell up', () => {
        expect(rek.getCellUp(rek.getCellNumber('H8'), 1))
            .toBe(undefined);
    });
});

describe('cell left', () => {
    it('tests cell Left', () => {
        expect(rek.getCellLeft(rek.getCellNumber('A8'), 1))
            .toBe(undefined);
    });
    it('tests cell Left', () => {
        expect(rek.getCellLeft(rek.getCellNumber('C6'), 1))
            .toBe(rek.getCellNumber('B6'));
    });
    it('tests cell Left', () => {
        expect(rek.getCellLeft(rek.getCellNumber('H1'), 1))
            .toBe(rek.getCellNumber('G1'));
    });
    it('tests cell Left', () => {
        expect(rek.getCellLeft(rek.getCellNumber('A1'), 1))
            .toBe(undefined);
    });
    it('tests cell Left', () => {
        expect(rek.getCellLeft(rek.getCellNumber('B1'), 1))
            .toBe(rek.getCellNumber('A1'));
    });
});

describe('cell Right', () => {
    it('tests cell Right', () => {
        expect(rek.getCellRight(rek.getCellNumber('A8'), 1))
            .toBe(rek.getCellNumber('B8'));
    });
    it('tests cell Right', () => {
        expect(rek.getCellRight(rek.getCellNumber('C6'), 1))
            .toBe(rek.getCellNumber('D6'));
    });
    it('tests cell Right', () => {
        expect(rek.getCellRight(rek.getCellNumber('H1'), 1))
            .toBe(undefined);
    });
    it('tests cell Right', () => {
        expect(rek.getCellRight(rek.getCellNumber('H8'), 1))
            .toBe(undefined);
    });
});

it('remove piece', () => {
    let cell = rek.getCellNumber('A2');
    expect(startArr[cell]).not.toBe('');
    rek.removePieceFromArr('A2', startArr);
    expect(startArr[cell]).toBe('');
});
describe('rook', () => {
    it('get moves rook', () => {
        let cellClicked = rek.getCellNumber('A1');
        expect(rek.getCorrectMoves(cellClicked, startArr)).toEqual([]);
    });

    it('get moves rook', () => {
        rek.removePieceFromArr('B1', startArr);
        let cellClicked = rek.getCellNumber('A1');
        expect(rek.getCorrectMoves(cellClicked, startArr))
            .toEqual([rek.getCellNumber('B1')]);
    });

    it('get moves rook', () => {
        rek.removePieceFromArr('B1', startArr);
        rek.removePieceFromArr('A2', startArr);
        rek.setPieceOnBoardArr('whitePawn', 'A3', startArr);
        let cellClicked = rek.getCellNumber('A1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('B1'), rek.getCellNumber('A2')].sort());
    });
    it('get moves rook', () => {
        rek.removePieceFromArr('A2', startArr);
        rek.removePieceFromArr('A7', startArr);
        let cellClicked = rek.getCellNumber('A1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('A2'), rek.getCellNumber('A3'), rek.getCellNumber('A4'), rek.getCellNumber('A5'), rek.getCellNumber('A6'), rek.getCellNumber('A7'), rek.getCellNumber('A8')].sort());
    });
    it('get moves rook', () => {
        rek.removePieceFromArr('A2', startArr);
        let cellClicked = rek.getCellNumber('A1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('A2'), rek.getCellNumber('A3'),
                rek.getCellNumber('A4'), rek.getCellNumber('A5'),
                rek.getCellNumber('A6'), rek.getCellNumber('A7')
            ].sort());
    });
});
describe('bishop', () => {

    it('get moves bishop', () => {

        let cellClicked = rek.getCellNumber('C1');
        expect(rek.getCorrectMoves(cellClicked, startArr))
            .toEqual([]);
    });
    it('get moves bisshop', () => {
        rek.removePieceFromArr('B2', startArr);
        let cellClicked = rek.getCellNumber('C1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('B2'), rek.getCellNumber('A3')].sort());
    });

    it('get moves bisshop', () => {
        rek.removePieceFromArr('B2', startArr);
        rek.removePieceFromArr('D2', startArr);

        let cellClicked = rek.getCellNumber('C1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('B2'), rek.getCellNumber('A3'), rek.getCellNumber('D2'), rek.getCellNumber('E3'), rek.getCellNumber('F4'), rek.getCellNumber('G5'), rek.getCellNumber('H6')].sort());
    });

    it('get moves bisshop', () => {
        rek.removePieceFromArr('B2', startArr);
        rek.removePieceFromArr('D2', startArr);
        rek.setPieceOnBoardArr('blackQueen', 'E3', startArr);
        let cellClicked = rek.getCellNumber('C1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('B2'), rek.getCellNumber('A3'), rek.getCellNumber('D2'), rek.getCellNumber('E3')].sort());
    });

    it('get moves bisshop', () => {
        rek.removePieceFromArr('B7', startArr);
        rek.removePieceFromArr('D7', startArr);
        rek.setPieceOnBoardArr('blackQueen', 'A6', startArr);
        let cellClicked = rek.getCellNumber('C8');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('B7'), rek.getCellNumber('D7'), rek.getCellNumber('E6'), rek.getCellNumber('F5'), rek.getCellNumber('G4'), rek.getCellNumber('H3')].sort());
    });
});

describe('queen', () => {

    it('get moves queen', () => {

        let cellClicked = rek.getCellNumber('D1');
        expect(rek.getCorrectMoves(cellClicked, startArr))
            .toEqual([]);
    });
    it('get moves queen', () => {
        rek.removePieceFromArr('C2', startArr);
        let cellClicked = rek.getCellNumber('D1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('C2'), rek.getCellNumber('B3'), rek.getCellNumber('A4')].sort());
    });

    it('get moves queen', () => {
        rek.removePieceFromArr('E1', startArr);
        rek.removePieceFromArr('E2', startArr);

        let cellClicked = rek.getCellNumber('D1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('E1'), rek.getCellNumber('E2'), rek.getCellNumber('F3'), rek.getCellNumber('G4'), rek.getCellNumber('H5')].sort());
    });

    it('get moves queen', () => {
        rek.removePieceFromArr('E1', startArr);
        rek.removePieceFromArr('D2', startArr);
        rek.setPieceOnBoardArr('blackQueen', 'D5', startArr);
        let cellClicked = rek.getCellNumber('D1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('E1'), rek.getCellNumber('D2'), rek.getCellNumber('D3'), rek.getCellNumber('D4'), rek.getCellNumber('D5')].sort());
    });
    it('get moves queen', () => {
        rek.removePieceFromArr('E1', startArr);
        rek.removePieceFromArr('D2', startArr);
        rek.setPieceOnBoardArr('whiteQueen', 'D5', startArr);
        let cellClicked = rek.getCellNumber('D1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('E1'), rek.getCellNumber('D2'), rek.getCellNumber('D3'), rek.getCellNumber('D4')].sort());
    });

    it('get moves queen', () => {
        rek.removePieceFromArr('D2', startArr);
        rek.removePieceFromArr('D7', startArr);
        let cellClicked = rek.getCellNumber('D1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('D2'), rek.getCellNumber('D3'), rek.getCellNumber('D4'), rek.getCellNumber('D5'), rek.getCellNumber('D6'), rek.getCellNumber('D7'), rek.getCellNumber('D8')].sort());
    });

    it('get moves queen', () => {
        rek.removePieceFromArr('D7', startArr);
        rek.setPieceOnBoardArr('blackQueen', 'D5', startArr);


        let cellClicked = rek.getCellNumber('D8');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('D7'), rek.getCellNumber('D6')].sort());
    });

});

describe('knight', () => {
    it('get moves knight', () => {
        let cellClicked = rek.getCellNumber('B1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('A3'), rek.getCellNumber('C3')].sort());
    });
    it('get moves knight', () => {
        rek.removePieceFromArr('D2', startArr);
        let cellClicked = rek.getCellNumber('B1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('A3'), rek.getCellNumber('C3'), rek.getCellNumber('D2')].sort());
    });
});

describe('king', () => {
    fit('get moves king', () => {
        let cellClicked = rek.getCellNumber('E1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([].sort());
    });
    fit('get moves king', () => {
        rek.removePieceFromArr('E2', startArr);
        rek.removePieceFromArr('F2', startArr);

        rek.removePieceFromArr('D1', startArr);
        rek.removePieceFromArr('F1', startArr);
        rek.removePieceFromArr('G1', startArr);
        let cellClicked = rek.getCellNumber('E1');
        expect(rek.getCorrectMoves(cellClicked, startArr).sort())
            .toEqual([rek.getCellNumber('E2'), rek.getCellNumber('D1'), rek.getCellNumber('F1'), rek.getCellNumber('F2')].sort());
    });
});