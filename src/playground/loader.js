import {botClassesArray} from "../bots/config";

/**
 * Загрузчик ботов из файла.
 */
export class Loader {
    constructor() {
        this._bots = [];
    }

    /**
     * Инициализировать ботов, полученных из конфига.
     */
    load() {
        this._bots = botClassesArray.map(botClass => new botClass());
    }

    /**
     * Получить объекты всех ботов.
     */
    getBotControllers() {
        return this._bots || [];
    }
}
