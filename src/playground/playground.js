import {config} from "../api-config";
import {Loader} from "./loader";
import {Api} from "./api";
import {ACTIONS} from "./config/actions";
import {STATUSES} from "./config/statuses";
import {CELL_TYPES} from "./config/cell-types";
import {ReplaySubject} from "rxjs";
import {FireController} from "./fire-contoller";
import {randomizeColor} from "./randomize-color";

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
        this._fireController = new FireController(this);
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

    /**
     * Получаем массив всех выстрелов.
     */
    get fires() {
        return this._fireController.immutableFires;
    }

    /**
     * Получаем копию карты.
     */
    get immutableMap() {
        return this._maps
            .map(column => column.slice())
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
     * Позиция существует в пределах игрового поля.
     */
    static _isPositionExist(position) {
        return !(!position
            || position.x < 0 || position.y < 0
            || position.x >= config.column || position.y >= config.row);
    }

    /**
     * Спрашиваем является ли указанная позиция препятствием.
     */
    positionIsBarricade(position) {
        return this._maps[position.x][position.y] === CELL_TYPES.barricade;
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
            bot.setBackgroundColor(randomizeColor(ind));
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
     */
    initPlayerPositions() {
        this._positions = new Array(this._bots.length).fill(0);
        /** если объединить fill + map в {@link _isUniquePosition} .every undefined */
        this._positions = this._positions.map(() => this._createUniquePosition());
        this._positions.forEach(pos => this._maps[pos.x][pos.y] = CELL_TYPES.player);
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
        if (!Playground._isPositionExist(position)) {
            return false;
        }
        return position
            && this._maps[position.x][position.y] === CELL_TYPES.ground;
    }

    /**
     * Позиция бота по его порядковому номеру.
     */
    getImmutablePositionByIndex(index) {
        return Object.assign({}, this._positions[index]);
    }

    /**
     * Устанавливаем действие по номеру бота.
     */
    setStepByBotIndex(index, step) {
        this._steps[index] = step;
    }

    /**
     * Получаем текущий шаг бота.
     */
    getStepByBotIndex(index) {
        return this._steps[index] || ACTIONS.nothing;
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
        const newPos = this.getImmutablePositionByIndex(index);
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
    createFireByBotIndex(index, vector) {
        if (this.getStepByBotIndex(index) !== ACTIONS.fire) {
            return;
        }

        const position = this.getImmutablePositionByIndex(index);
        Playground._processChangePosition(position, vector);
        this._fireController.create(index, position, vector);
    }

    sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    /**
     * Запустить просчитывание хода для всех ботов.
     */
    async doStep() {
        this._bots
            .filter((_, ind) => this.isBotLiveByIndex(ind))
            .forEach(bot => bot.doStep());

        for (let stepIndex = 0; stepIndex < config.multipleFactorFireSpeed; stepIndex++) {
            this._doStep$$.next(false);
            this._fireController.process();
            await this.sleep(config.stepTime);
        }

        this._steps
            .forEach(this._changePositionByIndex.bind(this));

        this._doStep$$.next(true);
        this.start();
    }

    /**
     * Бот с указанным индексом жив.
     */
    isBotLiveByIndex(index) {
        return this._statuses[index] === STATUSES.live;
    }

    /**
     * Проверяем персонажей под огнем.
     */
    playerOnFire(botIndex, firePos) {
        const pos = this._positions;
        const enemyIndex = pos.findIndex(botPos => botPos.x === firePos.x && botPos.y === firePos.y);
        if (enemyIndex !== -1) {
            this._statuses[enemyIndex] = STATUSES.dead;
            const {x, y} = pos[enemyIndex];
            this._maps[x][y] = CELL_TYPES.ground;
        }
    }

    /**
     * Изменяем позицию в зависимости от действия.
     * @param index - порядковый номер бота
     * @param action - {@link ACTIONS}
     */
    _changePositionByIndex(action, index) {
        const position = this._positions[index];
        if (!this.canPlayerDoesMoveAction(index, action)) {
            return;
        }

        this._maps[position.x][position.y] = CELL_TYPES.ground;
        Playground._processChangePosition(position, action);
        this._maps[position.x][position.y] = CELL_TYPES.player;
    }

    /**
     * Получаем всех врагов для бота с указанным индексом.
     * ВАЖНО: используя данный метод, вы исключите себя из массива позиций.
     * СЛЕДОВАТЕЛЬНО: нельзя использовать !!!botIndex!!!
     * Так как он будет некорректным после вашего индекса.
     */
    getEnemyPositionForIndex(index) {
        const myPos = this.getImmutablePositionByIndex(index);
        return this._positions
            .filter(pos => !(pos.x === myPos.x && pos.y === myPos.y))
            .map(pos => Object.assign({}, pos));
    }

    /**
     * Запуск игры.
     */
    start() {
        this.initSteps();
        setTimeout(this.doStep.bind(this), config.stepTime);
    }
}
