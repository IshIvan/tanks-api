import {Bot} from "../playground/bot";
import {ACTIONS} from "../playground/config/actions";

export class Mngame extends Bot {
    constructor() {
        super();
        this.name = 'N O G I B A T O R';
    }

    compareVector(pos1, pos2) {
        return pos1.x === pos2.x || pos1.y === pos2.y;
    }

    doStep() {
        const fires = this.fires;
        const myPos = this.myPosition;
        if (this._avoidFires(myPos, fires) || this._kill(myPos)) {
            return;
        }
        this._chase(myPos);
    }

    /**
     * Избегаем выстрелов, если они есть.
     */
    _avoidFires(myPos, fires) {
        if (!fires.length) {
            return false;
        }
        const fire = fires.find(fire => this.compareVector(fire.position, myPos));
        if (!fire) {
            return false;
        }

        if (fire.position.x === myPos.x
            && (fire.vector === ACTIONS.left || fire.vector === ACTIONS.right)) {
            if (this.canIDoMoveAction(ACTIONS.up)) {
                this.up();
            } else {
                this.down();
            }
        } else {
            if (fire.vector !== ACTIONS.up && fire.vector === ACTIONS.down) {
                return false;
            }
            if (this.canIDoMoveAction(ACTIONS.left)) {
                this.left();
            } else {
                this.right();
            }
        }

        return true;
    }

    _kill(myPos) {
        const enemies = this.enemies;
        const enemyPos = enemies.find(enemy => this.compareVector(enemy, myPos));
        if (!enemyPos) {
            return false;
        }
        if (enemyPos.x === myPos.x) {
            if (enemyPos.y > myPos.y) {
                this.fire(ACTIONS.down);
            } else {
                this.fire(ACTIONS.up);
            }
        } else {
            if (enemyPos.x > myPos.x) {
                this.fire(ACTIONS.right)
            } else {
                this.fire(ACTIONS.left)
            }
        }

        return true;
    }

    _chase(myPos) {
        const enemies = this.enemies;
        if (!enemies.length) {
            return;
        }
        const range = enemies
            .map(b => b.location)
            .map(pos => (myPos.x - pos.x) ^ 2 + (myPos.y - pos.y) ^ 2);
        const minRangeIndex = range.reduce((prev, curr, ind, arr) => Math.min(arr[prev], curr) === curr ? ind : prev, 0);
        const minRangeEnemyPos = enemies[minRangeIndex];
        if (Math.abs(minRangeEnemyPos.x - myPos.x) > Math.abs(minRangeEnemyPos.y - myPos.y)) {
            if (minRangeEnemyPos.y - myPos.y > 0) {
                this.down();
            } else {
                this.up();
            }
        } else {
            if (minRangeEnemyPos.x - myPos.x > 0) {
                this.right();
            } else {
                this.left();
            }
        }
    }
}