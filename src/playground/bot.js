/**
 * Класс бота, который необходимо наследовать для реализации своей логики.
 */
import {config} from "../api-config";
import {ACTIONS} from "./config/actions";

export class Bot {
    constructor() {
        this._api = null;
        this.name = 'Меня не переименовали';
        this.style = {
            imgStyle: {
                backgroundColor: 'black'
            }
        };
    }

    /**
     * Текущая позиция бота.
     * @link Api.position
     */
    get myPosition() {
        return this._api.position;
    }

    /**
     * @link Api.enemyPosition
     */
    get enemies() {
        return this._api.enemies;
    }

    /**
     * Геттер всех выстрелов.
     */
    get fires() {
        return this._api.fires;
    }

    /**
     * Зарегистировать бота через его АПИ.
     */
    register(api) {
        this._api = api;
    }

    /**
     * Сделать ход.
     */
    doStep() {
    }

    /**
     * Не делать ничего.
     */
    sleep() {
        this._api.doNothing();
    }

    /**
     * Упрощенное перемещение.
     */
    move(action) {
        switch (action) {
            case ACTIONS.left:
                this.left();
                break;
            case ACTIONS.right:
                this.right();
                break;
            case ACTIONS.down:
                this.down();
                break;
            case ACTIONS.up:
                this.up();
                break;
            default:
                this.up();
                break;
        }
    }

    /**
     * Сделать шаг наверх.
     */
    up() {
        this._api.up();
    }

    /**
     * Сделать шаг вниз.
     */
    down() {
        this._api.down();
    }

    /**
     * Сделать шаг влево.
     * @private
     */
    left() {
        this._api.left();
    }

    /**
     * Сделать шаг вправо.
     */
    right() {
        this._api.right();
    }

    /**
     * Выстрелить в указанном направлении.
     * @link Api.fire
     */
    fire(vector = ACTIONS.up) {
        this._api.fire(vector);
    }

    /**
     * Спросить, был ли сделан шаг в данном ходе.
     * Не считается ходом.
     */
    haveIStep() {
        return this._api.haveIStep();
    }

    /**
     * @param moveActions
     * @link Api.canIGoTo
     */
    canIDoMoveAction(moveActions) {
        return this._api.canIGoTo(moveActions);
    }

    /**
     * Задать цвет боту.
     */
    setBackgroundColor(color) {
        this.style.imgStyle = {
            backgroundColor: color
        };
    }

    /**
     * Получить игровую карту.
     */
    get gameMap() {
        return this._api.gameMap;
    }

    /**
     * Получить размеры карты.
     * @return number[], где первое число - количество столбцов, а второе - строк.
     */
    get gameMapSize() {
        return [config.column, config.row];
    }

    /**
     * Получаем авиаудар,
     * @return Strike | null
     */
    get strike() {
        return this._api.strike;
    }

    get history() {
        return this._api.history;
    }
}
