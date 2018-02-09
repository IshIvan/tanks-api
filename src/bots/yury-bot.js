import {Bot} from "../playground/bot";
import {ACTIONS} from "../playground/config/actions";

/**
 * Тестовый бот.
 */
export class YuryBot extends Bot {
    constructor() {
        super();
        this._fire = false;
        this.randomStep = 0;
        this.randomFire = 0;
        this.name = 'Ветерок';
        this.stepCount = 0;
    }

    doRandomStep(min, max) {
        let random = (Math.random() * (max - min) + min);
        this.randomStep = Number((random).toFixed(0));
        return this.randomStep;
    }

    doRandomFire(min, max) {
        let random = (Math.random() * (max - min) + min);
        this.randomFire = Number((random).toFixed(0));
        return this.randomFire;
    }

    doStep() {
        this.doRandomStep(0, 4);

        if (this.randomStep === 0) {
            this.up();
            this.stepCount += 1;
        } else if (this.randomStep === 1) {
            this.right();
            this.stepCount += 1;
        } else if (this.randomStep === 2) {
            this.down();
            this.stepCount += 1;
        } else if (this.randomStep === 3) {
            this.left();
            this.stepCount += 1;
        }

        if (this.stepCount % 6 === 0) {
            this.doRandomFire(0, 4);

            if (this.randomFire === 0) {
                this.fire(ACTIONS.up);
                this.doRandomStep(0, 4);
            } else if (this.randomFire === 1) {
                this.fire(ACTIONS.right);
                this.doRandomStep(0, 4);
            } else if (this.randomFire === 2) {
                this.fire(ACTIONS.down);
                this.doRandomStep(0, 4);
            } else if (this.randomFire === 3) {
                this.fire(ACTIONS.left);
                this.doRandomStep(0, 4);
            }

        }

    }
}
