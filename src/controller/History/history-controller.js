import {ACTIONS} from "../../playground/config/actions";
import {Step} from "../../model/common/step";

export class HistoryController {
    constructor() {

    }

    initHistory(botNumber) {
        this.history = new Array(botNumber).fill(0);
        this.history = this.history.map(_ => []);
    }

    addMoveStep(ind, type, movedTo) {
        this.history[ind].push(new Step({type, movedTo}));
    }

    addFireStep(ind, fire) {
        const type = ACTIONS.fire;
        this.history[ind].push(new Step({type, fire}));
    }

    getHistoryByIndex(ind) {
        return this.history[ind];
    }

    getLastStepByBotIndex(ind) {
        const h = this.history[ind];
        return h[h.length - 1];
    }
}