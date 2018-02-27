export class Reken {
    constructor() {

        this.columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    }
    getBoardNumber(i) {
        return i !== null && i >= 0 && i < 64 ? this.columns[(i % 8)] + Math.floor(9 - (i + 1) / 8) : undefined;
    }
}