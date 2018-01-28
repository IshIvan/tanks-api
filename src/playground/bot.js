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
      this._up();
    }

    /**
     * Не делать ничего.
     * @private
     */
    _sleep() {
        this._api.doNothing();
    }

    /**
     * Сделать шаг наверх.
     * @private
     */
    _up() {
        this._api.up();
    }

    /**
     * Сделать шаг вниз.
     * @private
     */
    _down() {
        this._api.down();
    }

    /**
     * Сделать шаг влево.
     * @private
     */
    _left() {
        this._api.left();
    }

    /**
     * Сделать шаг вправо.
     * @private
     */
    _rigth() {
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
    _haveIStep() {
        return this._api.haveIStep();
    }
}
