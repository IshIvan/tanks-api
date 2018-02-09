import {Bot} from "../playground/bot";
import {ACTIONS} from "../playground/config/actions";
import {CELL_TYPES} from "../playground/config/cell-types";

/**
 * Тестовый бот.
 */
export class VishnyaBot extends Bot {

    constructor() {
        super();

        this.name = 'SUPER THRASHER 4000 '
    }

    doStep() {
        this.myPosition;
        let waveMap = this.doWaveTick();

        let nextBulletMovePrediction = this.getBulletHitPredictionMove(waveMap);
        if (nextBulletMovePrediction !== ACTIONS.nothing) {
            this.move(nextBulletMovePrediction);
            return;
        }

        const {x: myX, y: myY} = this.myPosition;
        let nearestEnemy = this.findNearestEnemy(waveMap);
        let hasAttack = false;

        if (nearestEnemy.enemy === null) {
            this.sleep();
            return;
        }

        let dx = nearestEnemy.enemy.x - myX;
        let dy = nearestEnemy.enemy.y - myY;

        if (nearestEnemy.distance <= 2) {
            if (dx === 0) {
                if (nearestEnemy.enemy.y > myY) {
                    this.fire(ACTIONS.down);
                } else {
                    this.fire(ACTIONS.up);
                }
                hasAttack = true;
            }

            if (dy === 0) {
                if (nearestEnemy.enemy.x > myX) {
                    this.fire(ACTIONS.right);
                } else {
                    this.fire(ACTIONS.left);
                }
                hasAttack = true;
            }

        }

        if (hasAttack) return;

        const [mapWidth, mapHeight] = this.gameMapSize;

        let action1 = ACTIONS.nothing;
        let action2 = ACTIONS.nothing;
        let action3 = ACTIONS.nothing;
        let action4 = ACTIONS.nothing;

        if (dx > 0 && dy > 0) {
            action1 = ACTIONS.right;
            action2 = ACTIONS.up;
            action3 = ACTIONS.left;
            action4 = ACTIONS.down;
        }

        if (dx > 0 && dy <= 0) {
            action1 = ACTIONS.right;
            action2 = ACTIONS.down;
            action3 = ACTIONS.left;
            action4 = ACTIONS.up;
        }

        if (dx < 0 && dy > 0) {
            action1 = ACTIONS.left;
            action2 = ACTIONS.up;
            action3 = ACTIONS.right;
            action4 = ACTIONS.down;
        }

        if (dx < 0 && dy <= 0) {
            action1 = ACTIONS.left;
            action2 = ACTIONS.down;
            action3 = ACTIONS.left;
            action4 = ACTIONS.up;
        }

        if (this.canIDoMoveAction(action1)) {
            this.move(action1);
            return;
        }

        if (this.canIDoMoveAction(action2)) {
            this.move(action2);
            return;
        }

        if (this.canIDoMoveAction(action3)) {
            this.move(action3);
            return;
        }

        if (this.canIDoMoveAction(action4)) {
            this.move(action4);
            return;
        }

        this.sleep();

    }

    getBulletHitPredictionMove(waveMap) {
        const {x: myX, y: myY} = this.myPosition;
        const [mapWidth, mapHeight] = this.gameMapSize;

        let fires = this.fires;

        //next step position
        fires.forEach((fire) => {
            if (fire.vector === ACTIONS.up) {
                fire.position.y--;
            }

            if (fire.vector === ACTIONS.down) {
                fire.position.y++;
            }

            if (fire.vector === ACTIONS.left) {
                fire.position.x--;
            }

            if (fire.vector === ACTIONS.right) {
                fire.position.x++;
            }
        });

        let isFreeFromBullet = (x, y) => {
            return !fires.some((fire) => {
                return fire.position.x === x && fire.position.y === y;
            })
        };

        let predictionCount = 0;
        let action = ACTIONS.nothing;
        if (myX + 1 < mapWidth && isFreeFromBullet(myX + 1, myY)) {
            action = ACTIONS.right;
            predictionCount++;
        }

        if (myX - 1 >= 0 && isFreeFromBullet(myX - 1, myY)) {
            action = ACTIONS.left;
            predictionCount++;
        }

        if (myY + 1 < mapHeight && isFreeFromBullet(myX, myY + 1)) {
            action = ACTIONS.down;
            predictionCount++;
        }

        if (myY - 1 >= 0 && isFreeFromBullet(myX, myY - 1)) {
            action = ACTIONS.up;
            predictionCount++;
        }

        if (predictionCount !== 4) return action;

        return ACTIONS.nothing;
    }

    findNearestEnemy(waveMap) {
        const enemies = this.enemies;
        let nearest = {distance: 9999, enemy: null};

        enemies.forEach(({x: eX, y: eY}) => {
            let distance = waveMap[eX][eY];
            if (nearest.distance > distance) {
                nearest.distance = distance;
                nearest.enemy = {x: eX, y: eY};
            }
        });

        return nearest;
    }

    doWaveTick() {
        const {x: myX, y: myY} = this.myPosition;
        const [mapWidth, mapHeight] = this.gameMapSize;
        let waveMap = Util.init2dSquad(mapWidth, mapHeight);

        let d = 0;
        waveMap[myX][myY] = d;
        while (true) {
            let hasNext = false;
            for (let x = 0; x < mapWidth; x++) {
                for (let y = 0; y < mapWidth; y++) {
                    if (waveMap[x][y] === d) {
                        if (x + 1 < mapWidth && this.gameMap[x + 1][y] !== CELL_TYPES.barricade && typeof waveMap[x + 1][y] === 'undefined') {
                            waveMap[x + 1][y] = d + 1;
                            hasNext = true;
                        }

                        if (x - 1 >= 0 && this.gameMap[x - 1][y] !== CELL_TYPES.barricade && typeof waveMap[x - 1][y] === 'undefined') {
                            waveMap[x - 1][y] = d + 1;
                            hasNext = true;
                        }

                        if (y + 1 < mapHeight && this.gameMap[x][y + 1] !== CELL_TYPES.barricade && typeof waveMap[x][y + 1] === 'undefined') {
                            waveMap[x][y + 1] = d + 1;
                            hasNext = true;
                        }

                        if (y - 1 >= 0 && this.gameMap[x][y - 1] !== CELL_TYPES.barricade && typeof waveMap[x][y - 1] === 'undefined') {
                            waveMap[x][y - 1] = d + 1;
                            hasNext = true;
                        }
                    }
                }
            }
            d++;

            if (!hasNext) break;
        }

        return waveMap;
    }


}

class Util {
    static init2dSquad(firstDlength, secondDlength) {
        let array = [];
        for (let i = 0; i < firstDlength; i++) {
            array[i] = [];
            for (let j = 0; j < secondDlength; j++) {
                array[i][j] = void 0;
            }
        }

        return array;
    }
}
