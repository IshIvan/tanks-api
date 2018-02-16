export class ScoreController {
    constructor() {
        this._score = [];
    }

    /**
     * Создаем массив счета.
     */
    init(botNumber) {
        this._score = new Array(botNumber).fill(0);
    }

    /**
     * Добавляем одно очко.
     */
    addPoint(botIndex, point = 1) {
        if (botIndex > -1 && botIndex < this.points.length) {
            this._score[botIndex] += point;
        }
    }

    /**
     * Получить индекс победителя.
     */
    get winnerIndex() {
        return this._score.reduce((prev, curr, i) =>
            Math.max(this.points[prev], curr) === curr ? i : prev, 0);
    }

    /**
     * Получаем счет.
     */
    get points() {
        return this._score;
    }
}
