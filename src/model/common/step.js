import {ACTIONS} from "../../playground/config/actions";

export class Step {
    constructor({type, movedTo, fire}) {
        this.type = type;
        if (type === ACTIONS.fire) {
            this.fire = fire;
        } else {
            this.movedTo = movedTo;
        }
    }
}