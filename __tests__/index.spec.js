import {
    Reken
} from '../src/js/reken';
test('create schaakbord', () => {


    let rek = new Reken();

    // let x = document.querySelector('schaak-bord');
    expect(rek.getBoardNumber(0)).toBe('A8');
});