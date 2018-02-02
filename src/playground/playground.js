import {config} from "../api-config";
import {Loader} from "./loader";
import {Api} from "./api";
import {ACTIONS} from "./config/actions";
import {STATUSES} from "./config/statuses";
import {CELL_TYPES} from "./config/cell-types";
import {ReplaySubject} from "rxjs";

/**
 * Контроллер карты.
 */
export class Playground {
    constructor() {
        this.generateMaps();
        this.load();
        this.register();
        this.initSteps();
        this.initStatuses();
        this.initPlayerPositions();
        this.start();
        this._doStep$$ = new ReplaySubject(1);
    }

    /**
     * Генерируем смотрителя для новых ходов.
     */
    get stepper$() {
        return this._doStep$$.asObservable();
    }

    /**
     * Получаем всех игроков
     */
    get players() {
        return this._bots || [];
    }

    static _processChangePosition(position, action) {
        switch (action) {
            case ACTIONS.left:
                position.x--;
                break;
            case ACTIONS.right:
                position.x++;
                break;
            case ACTIONS.down:
                position.y++;
                break;
            case  ACTIONS.up:
                position.y--;
                break;
            default:
                break;
        }
    }

    /**
     * Загружаем объекты-контроллеры ботов.
     */
    load() {
        const loader = new Loader();
        loader.load();
        this._bots = loader.getBotControllers();
    }

    /**
     * Указываем каждую боту на его область доступа.
     * Чтобы бот мог управлять только своим состоянием.
     */
    register() {
        this._bots.forEach((bot, ind) => {
            const api = new Api(this, ind);
            bot.register(api);
        })
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
                this._maps[columnId][rowId] = (Math.random() * 100).toFixed(0) < 10
                    ? CELL_TYPES.barricade
                    : CELL_TYPES.ground;
            }
        }
    }

    /**
     * Обнуляем все действия ботов.
     */
    initSteps() {
        this._steps = new Array(this._bots.length).fill(-1);
    }

    /**
     * Оживляем всех ботов.
     */
    initStatuses() {
        this._statuses = new Array(this._bots.length).fill(STATUSES.live);
    }

    /**
     * Определение позиции игрока.
     * @todo проверку на препятстсиве
     */
    initPlayerPositions() {
        this._positions = new Array(this._bots.length).fill(0);
        /** если объединить fill + map в {@link _isUniquePosition} .every undefined */
        this._positions = this._positions.map(() => this._createUniquePosition());
    }

    /**
     * Создаем уникальную позицию,
     * которая не будет совпадать с баррикадой и противником.
     */
    _createUniquePosition() {
        let position = null;
        while (!this._isUniquePosition(position)) {
            position = {
                x: +(Math.random() * config.column).toFixed(0),
                y: +(Math.random() * config.row).toFixed(0)
            };
        }
        return position;
    }

    /**
     * Проверяем позицию на пересечения с противником и баррикадой.
     * Если ни с чем не пересекается, то true,
     * иначе false.
     */
    _isUniquePosition(position) {
        if (!position || position.x < 0 || position.y < 0) {
            return false;
        }
        return position
            && this._maps[position.x][position.y] !== CELL_TYPES.barricade
            && this._positions.every(pos => !(pos.x === position.x && pos.y === position.y))
    }

    /**
     * Позиция бота по его порядковому номеру.
     */
    getPositionByIndex(index) {
        return this._positions[index];
    }

    /**
     * Устанавливаем действие по номеру бота.
     */
    setStepByBotIndex(index, step) {
        this._steps[index] = step;
    }

    /**
     * Имеет ли данный бот право хода в данный момент.
     * Если бот ничего не делал, то имеет.
     * Спросить возможность хода не считается ходом.
     */
    hasStepByBotIndex(index) {
        return this._steps[index] === ACTIONS.nothing;
    }

    /**
     * Может ли бот выполнить действие по перемещению.
     */
    canPlayerDoesMoveAction(index, action) {
        const newPos = Object.assign({}, this.getPositionByIndex(index));
        Playground._processChangePosition(newPos, action);
        if (!this._isUniquePosition(newPos)) {
            return false;
        }

        switch (action) {
            case ACTIONS.left:
                return newPos.x > -1;
            case ACTIONS.right:
                return newPos.x < config.column;
            case  ACTIONS.up:
                return newPos.y > -1;
            case ACTIONS.down:
                return newPos.y < config.row;
            default:
                return false;
        }
    }

    /**
     * Добавляем выстрел от бота.
     * @link Api.fire
     */
    fireByBotIndex(index, shiftX, shiftY) {
        // todo добавить рисование выстрела
    }

    /**
     * Запустить просчитывание хода для всех ботов.
     */
    doStep() {
        this._bots.forEach(bot => bot.doStep());
        this._steps.forEach(this._changePositionByIndex.bind(this));
        this._doStep$$.next(true);
        this.start();
    }

    /**
     * Изменяем позицию в зависимости от действия.
     * @param index - порядковый номер бота
     * @param action - {@link ACTIONS}
     */
    _changePositionByIndex(action, index) {
        const position = this.getPositionByIndex(index);
        if (!this.canPlayerDoesMoveAction(index, action)) {
            return;
        }

        Playground._processChangePosition(position, action);
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

    /**
     * Получаем всех врагов для бота с указанным индексом.
     */
    getEnemyPositionForIndex(index) {
        const myPosition = this.getPositionByIndex(index);
        return this._positions.filter(position => position !== myPosition);
    }

    /**
     * Запуск игры.
     */
    start() {
        setTimeout(this.doStep.bind(this), config.stepTime);
    }
}
