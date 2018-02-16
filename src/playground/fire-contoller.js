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
            .map(fire => Object.assign({}, fire, {position: Object.assign({}, fire.position)}));
    }

    /**
     * Обработка движения выстрелов.
     */
    process(withChangePosition = true) {
        let index = 0;
        while (index < this._mutableFires.length) {
            const {botIndex, position, vector} = this.getByIndex(index);
            if (!Playground._isPositionExist(position)
                || this._playground.positionIsBarricade(position)
                || this._playground.playerOnFire(botIndex, position)) {
                // если вышло за поле, то удаляем
                this.deleteByIndex(index);
                continue;
            }

            if (withChangePosition) {
                Playground._processChangePosition(position, vector);
            }
            index++;
        }
    }

    /**
     * Создаем выстред.
     */
    create(index, position, vector) {
        const fire = {
            id: this._fireIdSequence++,
            botIndex: index,
            position: position,
            vector: vector
        };
        this._fires.push(fire);
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
}
