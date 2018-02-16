import {config} from "../api-config";
import {Loader} from "./loader";
import {Api} from "./api";
import {ACTIONS} from "./config/actions";
import {STATUSES} from "./config/statuses";
import {CELL_TYPES} from "./config/cell-types";
import {ReplaySubject} from "rxjs";
import {FireController} from "./fire-contoller";
import {randomizeColor} from "./randomize-color";
import {ScoreController} from "./score-controller";
import {AirStrikeController} from "../controller/Airstrike/airstrike-controller";
import {HistoryController} from "../controller/History/history-controller";
import {Enemy} from "../model/common/enemy";

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
        this._airController = new AirStrikeController();
        this._historyController = new HistoryController();
        this._historyController.initHistory(this.players.length);
        this._scoreController = new ScoreController();
        this._scoreController.init(this.players.length);
        this._doStep$$ = new ReplaySubject(1);
        this._win$$ = new ReplaySubject(1);
    }

    get winner$() {
        return this._win$$.asObservable();
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

    get points() {
        return this._scoreController.points;
    }

    get statuses() {
        return this._statuses;
    }

    get strike() {
        return this._airController.strike;
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
        this._positions = this._positions.map(
            () => {
                const pos = this._createUniquePosition();
                this._maps[pos.x][pos.y] = CELL_TYPES.player;
                return pos;
            });
    }

    /**
     * Создаем уникальную позицию,
     * которая не будет совпадать с баррикадой и противником.
     */
    _createUniquePosition() {
        let position = null;
        while (!this._isUniquePosition(position) || this._isPointNearByPlayer(position)) {
            position = {
                x: +(Math.random() * config.column).toFixed(0),
                y: +(Math.random() * config.row).toFixed(0)
            };
        }
        return position;
    }

    /**
     * Точка рядом с игроком.
     */
    _isPointNearByPlayer(point) {
        return [[1, 0], [-1, 0], [0, 1], [0, -1]]
            .some(([dx, dy]) =>
                this._maps[point.x + dx] &&
                this._maps[point.x + dx][point.y + dy] === CELL_TYPES.player);
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

        return this._maps[position.x][position.y] === CELL_TYPES.ground;
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
        if (this._steps[index] === ACTIONS.fire) {
            return;
        }
        this._steps[index] = step;
    }

    /**
     * Получаем текущий шаг бота.
     */
    getStepByBotIndex(index) {
        return this._steps[index] > -1 ? this._steps[index] : ACTIONS.nothing;
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
        if (!(this._isUniquePosition(newPos) && this._statuses[index] === STATUSES.live)) {
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
        if (vector < 0) {
            vector = ACTIONS.up;
        }
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
            .forEach(this._doStep.bind(this));
        // проверка выстрелов без изменения их позиции
        // необходимо для мгновенной регистрации первого положения выстрела
        this._fireController.process(false);
        this._doStep$$.next(true);
        this._steps.forEach(this._changePositionByIndex.bind(this));
        await this.sleep(config.stepTime);

        for (let stepIndex = 0; stepIndex < config.multipleFactorFireSpeed; stepIndex++) {
            this._doStep$$.next(false);
            this._fireController.process();
            await this.sleep(config.stepTime);
        }


        // регистрируем позиции для авиаудара
        const airStrikeWasDone = this._airController.registerChanges(this._positions, this._statuses);
        if (airStrikeWasDone) {
            this._airStrikeChangesHP();
        }

        if (this._isWin()) {
            this._addScoreToWinner();
            this._doStep$$.next(true);
            this._pushWinner();
        } else {
            this.start();
        }
    }

    /**
     * Достигнуто ли условие победы.
     */
    _isWin() {
        const liveBotNumber = this._statuses.filter((_, ind) => this.isBotLiveByIndex(ind)).length;
        return liveBotNumber < 2;
    }

    /**
     * Добавить очки при победе бота.
     * Подразумевается, что победить может только один.
     */
    _addScoreToWinner() {
        const winnerIndex = this._statuses.findIndex((_, i) => this.isBotLiveByIndex(i));
        this._scoreController.addPoint(winnerIndex, config.winnerPoints);
    }

    /**
     * Отправляем победителя.
     */
    _pushWinner() {
        const winnerIndex = this._scoreController.winnerIndex;
        const winner = {
            name: this._bots[winnerIndex].name,
            score: this.points[winnerIndex]
        };
        this._win$$.next(winner);
    }

    /**
     * Обработчик каждого хода ботов.
     */
    _doStep(bot, ind) {
        if (!this.isBotLiveByIndex(ind)) {
            return;
        }
        bot.doStep();
        const step = this._steps[ind];
        if (step === ACTIONS.fire) {
            this._historyController.addFireStep(ind, this.fires[this.fires.length - 1]);
        } else {
            const newPos = this.getImmutablePositionByIndex(ind);
            Playground._processChangePosition(newPos, step);
            this._historyController.addMoveStep(ind, step, newPos);
        }
    }

    /**
     * Ищем ботов, попавших под удар.
     */
    _airStrikeChangesHP() {
        const {topLeft, bottomRight} = this._airController.strike;
        this._positions.forEach((pos, ind) => {
            if (topLeft.x <= pos.x && pos.x <= bottomRight.x
                && topLeft.y <= pos.y && pos.y <= bottomRight.y) {
                this._changeStatus(ind);
            }
        });
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
        const enemyIndex = pos.findIndex(
            (botPos, ind) =>
                botPos.x === firePos.x && botPos.y === firePos.y && this.statuses[ind] === STATUSES.live);
        if (enemyIndex !== -1) {
            this._changeStatus(enemyIndex);
            this._scoreController.addPoint(botIndex);
            return true;
        }

        return false;
    }

    /**
     * Убиваем бота.
     */
    _changeStatus(botIndex) {
        this._statuses[botIndex] = STATUSES.dead;
        const {x, y} = this._positions[botIndex];
        this._maps[x][y] = CELL_TYPES.ground;
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
        return this._positions
            .map((pos, ind) =>
                new Enemy({
                    location: Object.assign({}, pos),
                    previousStep: this.getLastStepByBotIndex(ind),
                    name: this._bots[ind].name
                })
            )
            .filter((pos, ind) => ind !== index && this.isBotLiveByIndex(ind))
    }

    getHistoryByBotIndex(ind) {
        return this._historyController.getHistoryByIndex(ind);
    }

    getLastStepByBotIndex(ind) {
        return this._historyController.getLastStepByBotIndex(ind);
    }

    /**
     * Запуск игры.
     */
    start() {
        this.initSteps();
        setTimeout(this.doStep.bind(this), config.stepTime);
    }
}
