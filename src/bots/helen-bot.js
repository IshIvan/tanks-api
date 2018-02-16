import {Bot} from "../playground/bot";
import {ACTIONS} from "../playground/config/actions";
import {CELL_TYPES} from "../playground/config/cell-types";
import {config} from "../api-config";

export class HelenBot extends Bot {

    constructor() {
        super();

        this.name = 'no name';

        this._lastIndex = this.randomInteger(0, 3);
    }

    doStep() {
        const {x: myX, y: myY} = this.myPosition;
        const [sizeX, sizeY] = this.gameMapSize;
        let map = this.gameMap;
        let fires = this.fires;
        this.courses = [
            'right',
            'up',
            'left',
            'down',
        ];

        if (!this.canIDoMoveAction(ACTIONS.up)) {
            this.courses.splice(this.courses.indexOf('up'), 1);
        }
        if (!this.canIDoMoveAction(ACTIONS.down)) {
            this.courses.splice(this.courses.indexOf('down'), 1);
        }
        if (!this.canIDoMoveAction(ACTIONS.left)) {
            this.courses.splice(this.courses.indexOf('left'), 1);
        }
        if (!this.canIDoMoveAction(ACTIONS.right)) {
            this.courses.splice(this.courses.indexOf('right'), 1);
        }

        fires.forEach((fire) => {

            if (fire.position.x >= myX - config.multipleFactorFireSpeed && fire.position.x < myX
                && fire.vector === ACTIONS.right) { //летит слева

                if (fire.position.y === myY) {

                    this.courses.splice(this.courses.indexOf('left'), 1);
                    this.courses.splice(this.courses.indexOf('right'), 1);
                }
                // if (fire.position.y > myY && fire.position.y <= myY + config.multipleFactorFireSpeed) {
                //
                //     this.courses.splice(this.courses.indexOf('down'), 1);
                // }
                // if (fire.position.y < myY && fire.position.y >= myY - config.multipleFactorFireSpeed) {
                //
                //     this.courses.splice(this.courses.indexOf('up'), 1);
                // }
            }

            if (fire.position.x <= myX + config.multipleFactorFireSpeed && fire.position.x > myX
                && fire.vector === ACTIONS.left) { //летит справа
                if (fire.position.y === myY) {
                    this.courses.splice(this.courses.indexOf('left'), 1);
                    this.courses.splice(this.courses.indexOf('right'), 1);
                }
                // if (fire.position.y > myY && fire.position.y <= myY + config.multipleFactorFireSpeed) {
                //
                //     this.courses.splice(this.courses.indexOf('down'), 1);
                // }
                // if (fire.position.y < myY && fire.position.y >= myY - config.multipleFactorFireSpeed) {
                //
                //     this.courses.splice(this.courses.indexOf('up'), 1);
                // }
            }

            if (fire.position.y >= myY - config.multipleFactorFireSpeed && fire.position.y < myY
                && fire.vector === ACTIONS.down) { //летит сверху
                if (fire.position.x === myX) {

                    this.courses.splice(this.courses.indexOf('up'), 1);
                    this.courses.splice(this.courses.indexOf('down'), 1);
                }
                // if (fire.position.x > myX && fire.position.x <= myX + config.multipleFactorFireSpeed) {
                //
                //     this.courses.splice(this.courses.indexOf('rigth'), 1);
                // }
                // if (fire.position.x < myX && fire.position.x >= myX - config.multipleFactorFireSpeed) {
                //
                //     this.courses.splice(this.courses.indexOf('left'), 1);
                // }
            }

            if (fire.position.y <= myY + config.multipleFactorFireSpeed && fire.position.y > myY
                && fire.vector === ACTIONS.up) { //летит снизу
                if (fire.position.x === myX) {

                    this.courses.splice(this.courses.indexOf('up'), 1);
                    this.courses.splice(this.courses.indexOf('down'), 1);
                }
                // if (fire.position.x > myX && fire.position.x <= myX + config.multipleFactorFireSpeed) {
                //
                //     this.courses.splice(this.courses.indexOf('rigth'), 1);
                // }
                // if (fire.position.x < myX && fire.position.x >= myX - config.multipleFactorFireSpeed) {
                //
                //     this.courses.splice(this.courses.indexOf('left'), 1);
                // }
            }
        });

        this.freeStep();
    }

    freeStep() {

        let lastStep = this.courses[this._lastIndex];
        if (~this.courses.indexOf(ACTIONS[lastStep]) && this.canIDoMoveAction(ACTIONS[lastStep])) {
            this[lastStep]();
        } else {
            if (this.courses.length) {
                if (this.courses.length < 4) {
                    this._lastIndex = this.randomInteger(0, this.courses.length - 1);

                    let lastStep = this.courses[this._lastIndex];

                    if (this.canIDoMoveAction(ACTIONS[lastStep])) {
                        this[lastStep]();
                    }
                    else {
                        this.makeShot()
                    }
                }
                else {
                    if (this.closestAdversary().length) {
                        this.makeShot()
                    } else {
                        this._lastIndex = this.randomInteger(0, this.courses.length - 1);

                        let lastStep = this.courses[this._lastIndex];

                        if (this.canIDoMoveAction(ACTIONS[lastStep])) {
                            this[lastStep]();
                        }
                    }
                }
            }
            else {
                this.makeShot()
            }
        }
    }

    makeShot() {
        let coursesFire = this.closestAdversary();

        if (coursesFire.length) {
            let index = this.randomInteger(0, coursesFire.length - 1);
            this.fire(ACTIONS[coursesFire[index]]);
        } else {
            this.sleep();
        }
    }

    closestAdversary() {
        let map = this.gameMap;
        let coursesFire = [];
        const {x: myX, y: myY} = this.myPosition;
        const [sizeX, sizeY] = this.gameMapSize;

        for (let x = myX < 2 ? 0 : myX - 2; x < (myX + 3) && x < sizeX; x++) {
            for (let y = myY < 2 ? 0 : myY - 2; y < (myY + 3) && y < sizeY; y++) {
                if (map[x][y] === CELL_TYPES.player) {
                    if (myX === x && y !== myY) {
                        if (myY < y) {
                            if (this.canIDoMoveAction(ACTIONS.down)) {
                                coursesFire.push('down');
                            }
                        } else {
                            if (this.canIDoMoveAction(ACTIONS.up)) {
                                coursesFire.push('up');
                            }
                        }
                    }
                    if (myY === y && x !== myX) {
                        if (myX < x) {
                            if (this.canIDoMoveAction(ACTIONS.right)) {
                                coursesFire.push('right');
                            }
                        } else {
                            if (this.canIDoMoveAction(ACTIONS.left)) {
                                coursesFire.push('left');
                            }
                        }
                    }
                }
            }
        }

        return coursesFire;
    }

    randomInteger(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    }
}