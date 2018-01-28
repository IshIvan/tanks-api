import {config} from "../api-config";

/**
 * Контроллер карты.
 */
export class Playground {
    constructor() {
        this.generateMaps();
    }

    /**
     * Генерируем карту, где:
     * 0 - пустое поле,
     * 1 - препятствие.
     */
    generateMaps() {
        const {row, column} = config;
        this._maps = [];
        for (let columnId = 0; columnId < column; columnId++) {
            this._maps[columnId] = [];
            for (let rowId = 0; rowId < row; rowId++) {
                this._maps[columnId][rowId] = (Math.random() * 100).toFixed(0) < 10 ? 1 : 0;
            }
        }
        console.table(this._maps);
    }

    /**
     * Получаем строку по номеру столбца
     * @param columnIndex
     */
    getRow(columnIndex) {
        return this.getMap()[columnIndex];
    }

    /**
     * Получение карты.
     */
    getMap() {
        return this._maps;
    }
}