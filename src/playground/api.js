import {ACTIONS} from "./config/actions";

export class Api {
    constructor(playground, botIndex) {
        this._playground = playground;
        this._index = botIndex;
    }

    /**
     * Получение текущей позиции бота.
     */
    get position() {
        return this._playground.getImmutablePositionByIndex(this._index);
    }

    /**
     * Получаем врагов для текущего игрока.
     */
    get enemyPosition() {
        return this._playground.getEnemyPositionForIndex(this._index);
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
     * Могу ли я переместить в указанном направлении.
     */
    canIGoTo(moveAction) {
        return this._playground.canPlayerDoesMoveAction(this._index, moveAction);
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
     * @param vector - ACTION.up | down | left | right.
     */
    fire(vector) {
        this._playground.setStepByBotIndex(this._index, ACTIONS.fire);
        this._playground.createFireByBotIndex(this._index, vector);
    }

    /**
     * Любой выстрел отнимает хп.
     * Даже если бот попал сам по себе.
     */
    get fires() {
        return this._playground.fires;
    }

    /**
     * Получаем всю карту.
     */
    get gameMap() {
        return this._playground.immutableMap;
    }
}

