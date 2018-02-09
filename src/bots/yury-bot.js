import {Bot} from "../playground/bot";
import {ACTIONS} from "../playground/config/actions";

/**
 * Бот Юра.
 */

export class YuryBot extends Bot {
    constructor() {
        super();
        this._fire = false;
        this.name = 'Юра';
    }

    doStep() {
        if (this.canIDoMoveAction(ACTIONS.up)) {
            this.up();

        } else if (this.canIDoMoveAction(ACTIONS.right)) {
            this.right();

        } else if (this.canIDoMoveAction(ACTIONS.left)) {
            this.left();

        } else if (this.canIDoMoveAction(ACTIONS.down)) {
            this.down();

        }   // Если нельзя ехать наверх и влево
            else if (!this.canIDoMoveAction(ACTIONS.left) && !this.canIDoMoveAction(ACTIONS.up)) {

            // Но можно вниз
            if (this.canIDoMoveAction(ACTIONS.down)) {
                this.down();
                this.right();

                // Стрелять вниз при развороте
                // this.fire(ACTIONS.down);

            }  else {
                this.right();
                this.down();

                // Стрелять вниз при развороте
                // this.fire(ACTIONS.right);
            }

        }   // Если нельзя ехать наверх и вправо
            else if (!this.canIDoMoveAction(ACTIONS.right) && !this.canIDoMoveAction(ACTIONS.up)) {

            // Но можно вниз
            if (this.canIDoMoveAction(ACTIONS.down)) {
                this.down();
                this.left();

                // Стрелять вниз при развороте
                // this.fire(ACTIONS.down);

            }  else {
                this.left();
                this.down();

                // Стрелять вниз при развороте
                // this.fire(ACTIONS.left);
            }

        }   // Если нельзя ехать вниз и вправо
            else if (!this.canIDoMoveAction(ACTIONS.right) && !this.canIDoMoveAction(ACTIONS.down)) {

            // Но можно вверх
            if (this.canIDoMoveAction(ACTIONS.up)) {
                this.up();
                this.left();

                // Стрелять вниз при развороте
                // this.fire(ACTIONS.up);

            }  else {
                this.left();
                this.up();

                // Стрелять вниз при развороте
                // this.fire(ACTIONS.left);
            }

        }   // Если нельзя ехать вниз и влево
            else if (!this.canIDoMoveAction(ACTIONS.left) && !this.canIDoMoveAction(ACTIONS.down)) {

            // Но можно вверх
            if (this.canIDoMoveAction(ACTIONS.up)) {
                this.up();
                this.right();

                // Стрелять вниз при развороте
                // this.fire(ACTIONS.up);

            }  else {
                this.right();
                this.up();

                // Стрелять вниз при развороте
                // this.fire(ACTIONS.right);
            }

        }   // Если ничего не подходит, то пытайся бежать вниз

        else {
            this.down();
            this.fire(ACTIONS.down);
            if (!this.haveIStep()) {
                this.up();
                this.fire(ACTIONS.up);
            }
        }

        if (!this._fire) {
            this._fire = true;
            this.fire(ACTIONS.up);
        }
    }
}
