/**
 * Класс бота, который необходимо наследовать для реализации своей логики.
 */
export class Bot {
    constructor() {
        this._api = null;
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
    rigth() {
        this._api.right();
    }

    /**
     * Выстрелить в указанном направлении.
     * @link Api.fire
     */
    fire(shiftX, shiftY) {
        this._api.fire(shiftX, shiftY);
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
        return this._api.enemyPosition;
    }
}
