import {Bot} from "../playground/bot";
import {ACTIONS} from "../playground/config/actions";

export class AshotBot extends Bot {
    constructor() {
        super();
        this._fire = false;
        this.name = 'Ашот';
        this._lastFireVector = ACTIONS.left;
    }

    doStep() {

        if (this._lastFireVector === ACTIONS.up) {
            this._lastFireVector = ACTIONS.right;
        } else if (this._lastFireVector === ACTIONS.right) {
            this._lastFireVector = ACTIONS.down;
        } else if (this._lastFireVector === ACTIONS.down) {
            this._lastFireVector = ACTIONS.left;
        } else if (this._lastFireVector === ACTIONS.left) {
            this._lastFireVector = ACTIONS.up;
        }

        this.fire(this._lastFireVector);

    }
}
