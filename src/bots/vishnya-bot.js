import {Bot} from "../playground/bot";
import {ACTIONS} from "../playground/config/actions";
import {CELL_TYPES} from "../playground/config/cell-types";
import {config} from "../api-config";

export class VishnyaBot extends Bot {
    battleground;
    friends = ['Уборщик мусора'];
    forcedEnemyName;
    config = {
        preventRepeatCounter: 0,
        repetitionNumberThreshold: 5,
        maxWindowSize: 5,
        minWindowSize: 2,
    };

    constructor() {
        super();

        this.name = 'SUPER THRASHER 4000 '
    }

    doStep() {
        this.battleground = new Battleground(this._api, config);
        this.config.repetitionNumberThreshold = Math.max(config.column, config.row) / 2;

        if (this.battleground.isPlayerAttacked()) {
            this.move(this.getAvoidHitAction());
            return;
        }

        let nearestEnemies = this.battleground.getSortedByDistanceEnemies();

        if (nearestEnemies.length === 0) {
            this.sleep();
            return;
        }

        let nearestEnemy = null;
        for (let i = 0; i < nearestEnemies.length; i++) {
            if (this.forcedEnemyName === nearestEnemies[i].enemy.name) {
                nearestEnemy = nearestEnemies[i];
            }
        }

        if (nearestEnemy === null) {
            this.forcedEnemyName = null;
            for (let i = 0; i < nearestEnemies.length; i++) {
                if (this.friends.indexOf(nearestEnemies[i].enemy.name) < 0) {
                    nearestEnemy = nearestEnemies[i];
                    break;
                }
            }
        }

        let enemySelectionFailed = nearestEnemy === null;
        if (enemySelectionFailed) {
            nearestEnemy = nearestEnemies[0];
        }

        if (this.hasRepeatedPattern() && this.config.preventRepeatCounter-- <= 0) {
            this.config.preventRepeatCounter = this.config.repetitionNumberThreshold * 2;

            if (nearestEnemies.length === 1) {
                this.move(this.getRandomMove());
                return;
            } else {
                this.forcedEnemyName = nearestEnemies[Math.floor(Math.random() * nearestEnemies.length)].enemy.name;
            }
        }

        let attackAction = this.getAttackAction(nearestEnemy);
        if (attackAction !== null) {
            this.fire(attackAction);
            return;
        }

        let followMove = this.getEnemyFollowAction(nearestEnemy);
        if (followMove !== null) {
            this.move(followMove);
            return
        }

        this.sleep();
    }

    getAvoidHitAction() {
        let action = ACTIONS.nothing;
        if (this.battleground.isMoveValid(1, 0)) {
            action = ACTIONS.right;
        }

        if (this.battleground.isMoveValid(-1, 0)) {
            action = ACTIONS.left;
        }

        if (this.battleground.isMoveValid(0, 1)) {
            action = ACTIONS.down;
        }

        if (this.battleground.isMoveValid(0, -1)) {
            action = ACTIONS.up;
        }


        return action;
    }

    getAttackAction(enemy) {
        let dx = enemy.enemy.location.x - this.battleground.playerX;
        let dy = enemy.enemy.location.y - this.battleground.playerY;

        let fireAction = null;
        if (enemy.distance <= 2) {
            if (dx === 0) {
                if (dy > 0) {
                    fireAction = ACTIONS.down;
                } else {
                    fireAction = ACTIONS.up;
                }
            }

            if (dy === 0) {
                if (dx > 0) {
                    fireAction = ACTIONS.right;
                } else {
                    fireAction = ACTIONS.left;
                }
            }
        }

        return fireAction;
    }

    getEnemyFollowAction(enemy) {
        let eX = enemy.enemy.location.x;
        let eY = enemy.enemy.location.y;
        let myX = this.battleground.playerX;
        let myY = this.battleground.playerY;
        let path = this.battleground.map.findPathTo(eX, eY);

        if (path === null) return null;

        let nextStep = path[1] || {x: myX, y: myY};
        let dx = nextStep.x - myX;
        let dy = nextStep.y - myY;

        return Util.translateDeltaToAction(dx, dy);
    }

    hasRepeatedPattern() {
        const repetitionNumberThreshold = this.config.repetitionNumberThreshold;
        const maxWindowSize = this.config.maxWindowSize;
        const minWindowSize = this.config.minWindowSize;
        const history = this.history.slice().reverse();

        if (history.length < maxWindowSize * repetitionNumberThreshold) return false;

        for (let windowSize = minWindowSize; windowSize < maxWindowSize; windowSize++) {
            let chunks = [];
            for (let r = 0; r < repetitionNumberThreshold; r++) {
                chunks.push(history.slice(r * windowSize, windowSize * (r + 1)));
            }

            let patternFound = true;
            let previousChunk = chunks[0];
            for (let i = 1; i < chunks.length; i++) {
                let chunk = chunks[i];

                let chunksMatched = true;
                for (let s = 0; s < chunk.length; s++) {

                    if (!(
                            chunk[s].type === previousChunk[s].type
                            && (
                                (chunk[s].movedTo && previousChunk[s].movedTo && Util.isPointsEquals(chunk[s].movedTo, previousChunk[s].movedTo)))
                            || (chunk[s].fire && previousChunk[s].fire && chunk[s].fire.botIndex === previousChunk[s].fire.botIndex && Util.isPointsEquals(chunk[s].fire, previousChunk[s].fire))
                        )
                    ) {
                        chunksMatched = false;
                        break;
                    }
                }
                if (!chunksMatched) {
                    patternFound = false;
                    break;
                }
            }

            if (patternFound) return true;
        }

        return false;
    }

    getRandomMove() {
        let tries = 10;
        while (tries-- > 0) {
            let dxRand = Math.random();
            let dyRand = Math.random();
            let dx = dxRand > 0.3333 ? (dxRand > 0.6667 ? 1 : 0) : -1;
            let dy = dyRand > 0.3333 ? (dyRand > 0.6667 ? 1 : 0) : -1;
            if (this.battleground.isMoveValid(dx, dy)) {
                return Util.translateDeltaToAction(dx, dy);
            }
        }

        return ACTIONS.nothing;
    }
}

class Battleground {
    _bulletsSource;
    _nextStepBullets;
    _config;
    playerX;
    playerY;
    map;
    enemies;

    /**
     *
     * @param {Api} api
     * @param {config} config
     */
    constructor(api, config) {
        this._sourceMap = api.gameMap;
        this._bulletsSource = api.fires;
        this._config = config;
        this.playerX = api.position.x;
        this.playerY = api.position.y;
        this.enemies = api.enemies;

        this._nextStepBullets = this._createNextStepBulletList();
        this.map = new Map(this._config.column, this._config.row, this.playerX, this.playerY, this.isPointValid.bind(this))
    }

    isPointValid(x, y) {
        return !this.isBarricadeAtPoint(x, y)
            && !this.isPointHasBulletAtNextStep(x, y);
    }

    _createNextStepBulletList() {
        const originFires = JSON.parse(JSON.stringify(this._bulletsSource));
        let nextStepBullets = JSON.parse(JSON.stringify(originFires));

        for (let i = 1; i < this._config.multipleFactorFireSpeed + 1; i++) {
            originFires.forEach((fire) => {
                let newFire = JSON.parse(JSON.stringify(fire));
                if (newFire.vector === ACTIONS.up) {
                    newFire.position.y -= i;
                }

                if (newFire.vector === ACTIONS.down) {
                    newFire.position.y += i;
                }

                if (newFire.vector === ACTIONS.left) {
                    newFire.position.x -= i;
                }

                if (newFire.vector === ACTIONS.right) {
                    newFire.position.x += i;
                }

                nextStepBullets.push(newFire);
            })
        }

        return nextStepBullets;
    }

    isBarricadeAtPoint(x, y) {
        return this._sourceMap[x][y] === CELL_TYPES.barricade
    }

    isAnotherPlayerAtPoint(x, y) {
        return this._sourceMap[x][y] === CELL_TYPES.player
    }

    isPointHasBulletAtNextStep(x, y) {
        return this._nextStepBullets.some((fire) => {
            return fire.position.x === x && fire.position.y === y;
        });
    }

    isPlayerAttacked() {
        return this.isPointHasBulletAtNextStep(this.playerX, this.playerY);
    }

    isStepValid(x, y) {
        return this.map.isPointReachable(x, y) && !this.isPointHasBulletAtNextStep(x, y) && !this.isAnotherPlayerAtPoint(x, y);
    };

    isMoveValid(dx, dy) {
        return this.isStepValid(this.playerX + dx, this.playerY + dy);
    }

    getSortedByDistanceEnemies() {
        let enemies = this.enemies.map((enemy) => {
            let distance = this.map.getDistanceTo(enemy.location.x, enemy.location.y);
            return {
                distance,
                enemy
            };
        });
        enemies.sort((a, b) => a.distance - b.distance);
        return enemies;
    }
}

class Map {
    width;
    height;
    playerX;
    playerY;
    _pointValidator;
    _attainabilityMap;

    constructor(width, height, playerX, playerY, pointValidator) {
        this.width = width;
        this.height = height;
        this.playerX = playerX;
        this.playerY = playerY;
        this._pointValidator = pointValidator;
        this._attainabilityMap = this._createAttainabilityMap()
    }

    _createAttainabilityMap() {
        let map = Util.init2dSquad(this.width, this.height);

        let d = 0;
        map[this.playerX][this.playerY] = d;

        let isPointValid = (x, y) => {
            return this.isPointInBound(x, y) && this._pointValidator(x, y);

        };

        while (true) {
            let hasNext = false;
            let mapper = (x, y) => {
                if (map[x] && isPointValid(x, y) && typeof map[x][y] === 'undefined') {
                    map[x][y] = d + 1;
                    hasNext = true;
                }
            };
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    if (map[x][y] === d) {
                        Util.iterateOrthoVariants(x, y, mapper.bind(this));
                    }
                }
            }
            d++;

            if (!hasNext) break;
        }

        return map;
    }

    isPointInBound(x, y) {
        return 0 <= x && x < this.width
            && 0 <= y && y < this.height
    }

    isPointReachable(x, y) {
        return this.isPointInBound(x, y) && typeof this._attainabilityMap[x][y] !== 'undefined';
    }

    findPathTo(x, y) {
        if (!this.isPointReachable(x, y)) return [];

        let path = [];
        let currentPoint = {x, y};
        let previousValue = this._attainabilityMap[x][y];
        while (currentPoint.x !== this.playerX || currentPoint.y !== this.playerY) {
            let callback = (i, j) => {
                if (this._attainabilityMap[i] && typeof this._attainabilityMap[i][j] !== 'undefined' && this._attainabilityMap[i][j] === (previousValue - 1)) {
                    currentPoint = {x: i, y: j};
                    path.push(currentPoint);
                    previousValue--;
                    return true;
                }
            };

            Util.iterateOrthoVariants(currentPoint.x, currentPoint.y, callback.bind(this));
        }

        return path.reverse();
    }

    getDistanceTo(x, y) {
        return this._attainabilityMap[x][y];
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

    static iterateOrthoVariants(x, y, callback) {
        let needToPrevent = callback(x + 1, y);
        if (needToPrevent) return;
        needToPrevent = callback(x, y + 1);
        if (needToPrevent) return;
        needToPrevent = callback(x - 1, y);
        if (needToPrevent) return;
        callback(x, y - 1);
    }

    static isPointsEquals(a, b) {
        return a.x === b.x && a.y === b.y;
    }

    static translateDeltaToAction (dx, dy) {
        if (dx < 0) return ACTIONS.left;
        if (dx > 0) return ACTIONS.right;
        if (dy < 0) return ACTIONS.up;
        if (dy > 0) return ACTIONS.down;
        return ACTIONS.nothing;
    }

}
