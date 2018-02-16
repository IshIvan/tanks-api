import {config} from "../../api-config";
import {AirStrikeModel} from "../../model/airstrike/airstrike-model";
import {STATUSES} from "../../playground/config/statuses";

export class AirStrikeController {
    constructor() {
        this._generateMap();
        this._strike = null;
        this._destroyStepTimer = 0;
    }

    /**
     * Пришло ли время стрелять
     */
    get _isStrikeTime() {
        return this._destroyStepTimer === 0;
    }

    /**
     * Существует ли выстрел.
     */
    get isStrikeExist() {
        return this.strike !== null;
    }

    get strike() {
        return this._strike;
    }

    /**
     * Обрабатываем изменение позиций на игровом поле.
     * Приходят все позиции, необходимо обработать только живых.
     */
    registerChanges(positions, statuses = []) {
        if (!config.isAirStrikeModeEnabled) {
            console.warn('Авиаудары выключены в api-config.js');
            return;
        }

        this._increment(positions, statuses);
        if (this.isStrikeExist) {
            this._decrementTimer();
            return this._isStrikeTime;
        }
        const pos = this._findStartPosition();
        if (pos.x !== -1) {
            this._start(pos);
        }
        return false;
    }

    /**
     * Добавляем каждой точке карты маркер присутствия игрока.
     */
    _increment(positions, statuses) {
        positions.forEach((pos, ind) =>
            statuses[ind] === STATUSES.live ? this._maps[pos.x][pos.y]++ : null);
    }

    /**
     * Ищем первоначальную позицию.
     * Если
     */
    _findStartPosition() {
        let y = -1;
        const x = this._maps.findIndex(row => {
            y = row.findIndex(cell => cell > config.airStrikeNumber);
            return y !== -1;
        });

        return {x, y}
    }

    /**
     * Начинаем создание выстрела.
     */
    _start({x, y}) {
        const percent = Math.ceil(Math.random() * 100);
        if (percent > config.airStrikePercent) {
            return;
        }

        this._startStrike(x, y);
        this._resetPoint(x, y);
    }

    /**
     * Создание выстрела
     */
    _startStrike(x, y) {
        const radius = Math.ceil(Math.random() * 5);
        this._destroyStepTimer = radius;
        this._strike = new AirStrikeModel({x0: x, y0: y, radius})
    }

    /**
     * Инициализируем карту.
     */
    _generateMap() {
        this._maps = new Array(config.row).fill(0);
        this._maps = this._maps.map(_ => new Array(config.column).fill(0));
    }

    /**
     * Сбрасываем присутствие игрока в точке.
     */
    _resetPoint(x, y) {
        this._maps[x][y] = 0;
    }

    /**
     * Обработчик уменьшения таймера.
     */
    _decrementTimer() {
        this._destroyStepTimer--;
        this._strike.counter = this._destroyStepTimer;
        if (this._destroyStepTimer < 0) {
            this._strike = null;
        }
    }
}