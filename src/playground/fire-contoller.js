import {Playground} from "./playground";

/**
 * Контроллер всех выстрелов.
 */
export class FireController {
    constructor(playground) {
        /**
         * Уникальный номер, необходимый для key={id}
         */
        this._fireIdSequence = 0;
        this._fires = [];
        this._playground = playground;
    }

    /**
     * Обработка движения выстрелов.
     */
    process() {
        let index = 0;
        while (index < this._mutableFires.length) {
            const {botIndex, position, vector} = this.getByIndex(index);
            if (!Playground._isPositionExist(position) || this._playground.positionIsBarricade(position)) {
                // если вышло за поле, то удаляем
                this.deleteByIndex(index);
                continue;
            }

            // иначе изменяем позицию
            this._playground.playerOnFire(botIndex, position);
            Playground._processChangePosition(position, vector);
            index++;
        }
    }

    /**
     * Создаем выстред.
     */
    create(index, position, vector) {
        this._fires.push({
            id: this._fireIdSequence++,
            botIndex: index,
            position: position,
            vector: vector
        });
    }

    /**
     * Удаляем выстрел по индексу.
     */
    deleteByIndex(index) {
        this._fires.splice(index, 1);
    }

    /**
     * Получаем выстрел по индексу.
     * @param index
     * @returns {*}
     */
    getByIndex(index) {
        return this._fires[index];
    }

    /**
     * Получаем ссылочные выстрелы
     */
    get _mutableFires() {
        return this._fires;
    }

    /**
     * Получаем копии выстрелы.
     */
    get immutableFires() {
        return this._fires
            .map(fire => Object.assign({}, fire));
    }
}
