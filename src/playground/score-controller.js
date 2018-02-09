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
    addPoint(botIndex) {
        this._score[botIndex]++;
    }

    /**
     * Получаем счет.
     */
    get points() {
        return this._score;
    }
}
