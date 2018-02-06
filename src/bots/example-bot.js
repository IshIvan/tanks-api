import {Bot} from "../playground/bot";
import {ACTIONS} from "../playground/config/actions";

/**
 * Тестовый бот.
 */
export class ExampleBot extends Bot {
    constructor() {
        super();
        this._fire = false;
    }

    doStep() {
        if (this.canIDoMoveAction(ACTIONS.up)) {
            this.up();
        } else if (this.canIDoMoveAction(ACTIONS.right)) {
            this.right();
        } else {
            this.down();
        }
        if (!this._fire) {
            this._fire = true;
            this.fire(ACTIONS.up);
        }
    }
}
