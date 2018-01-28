import {ACTIONS} from "./config/actions";

export class Api {
    constructor(playground, botIndex) {
        this._playground = playground;
        this._index = botIndex;
    }

    /**
     * Не делать ничего на данном шаге.
     */
    doNothing() {
       this._playground.setStepByBotIndex(this._index, ACTIONS.nothing);
    }

    /**
     * Сходить влево.
     */
    left() {
        this._playground.setStepByBotIndex(this._index, ACTIONS.left);
    }

    /**
     * Сходить наверх.
     */
    up() {
        this._playground.setStepByBotIndex(this._index, ACTIONS.up);
    }

    /**
     * Сходить вправо.
     */
    right() {
        this._playground.setStepByBotIndex(this._index, ACTIONS.right);
    }

    /**
     * Сходить вниз.
     */
    down() {
        this._playground.setStepByBotIndex(this._index, ACTIONS.down);
    }

    /**
     * Сходить влево.
     */
    haveIStep() {
        return this._playground.hasStepByBotIndex(this._index);
    }

    /**
     * Выстреливаем в указанном направлении.
     * Необязательно двигаться в этом направлении.
     * К смещениям применяется XOR.
     * @param shiftX - лево / право
     * @param shiftY - верх / низ.
     */
    fire(shiftX, shiftY) {
        if (shiftX !== shiftY) {
            return;
        }
        this._playground.setStepByBotIndex(this._index, ACTIONS.fire);
        this._playground.fireByBotIndex(this._index, [shiftX, shiftY]);
    }
}
