//@ts-check
import {
    Reken
} from '../src/js/reken';

let rek;

beforeEach(() => {
    rek = new Reken();
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


test('getBoardNumber 1 ok', () => {
    expect(rek.getBoardNumber(0)).toBe('A8');
});
test('getBoardNumber 2 ok', () => {
    expect(rek.getBoardNumber(55)).toBe('H2');
});
test('getBoardNumber 3 ok', () => {
    expect(rek.getBoardNumber(63)).toBe('H1');
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