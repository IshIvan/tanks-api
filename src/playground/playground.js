import {config} from "../api-config";
import {Loader} from "./loader";
import {Api} from "./api";
import {ACTIONS} from "./config/actions";
import {STATUSES} from "./config/statuses";

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
        this.start();
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
                this._maps[columnId][rowId] = (Math.random() * 100).toFixed(0) < 10 ? 1 : 0;
            }
        }
        // console.table(this._maps);
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
        // todo setTimeout nextStep()
        console.log(this._steps);
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
     * Запуск игры.
     */
    start() {
        setTimeout(this.doStep.bind(this), 100);
    }
}
