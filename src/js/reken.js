export class Reken {
    constructor() {

        this.columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    }
    getBoardNumber(i) {
        return this.columns[(i % 8)] + Math.floor(9 - (i + 1) / 8);
    }
}
