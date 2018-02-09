import {Bot} from '../playground/bot';
import {ACTIONS as A} from '../playground/config/actions';

const utils = {

    invert2dArr: arr2d => {
        const inverted = [];

        for (let i = 0; i < arr2d.length; i++) {
            for (let j = 0; j < arr2d[i].length; j++) {
                if (!inverted[j]) {
                    inverted[j] = [];
                }

                inverted[j][i] = arr2d[i][j];
            }
        }

        return inverted;
    }


};

class Vector {
    constructor(a, b) {
        this.start = a;
        this.end = b;
    }

    getTiles() {
        const p1 = this.start.x === this.end.x ? 'y' : 'x';
        const p2 = p1 === 'x' ? 'y' : 'x';
        const tiles = [];

        for (let i = Math.min(this.start[p1], this.end[p1]); i <= Math.max(this.start[p1], this.end[p1]); i++) {
            const tile = {};
            tile[p1] = i;
            tile[p2] = this.start[p2];

            tiles.push(tile);
        }

        return tiles;
    }
}

/**
 * Тестовый бот.
 */
export class ABot extends Bot {
    isSafe;

    dirList = [A.up, A.right, A.down, A.left];

    constructor() {
        super();
        this.name = 'Run, Bot, run!';
    }

    doStep() {
        this._gameMap = utils.invert2dArr(this.gameMap);
        this._safeMap = this._getSafeMap();

        if (!this.isSafe) {
            this._travelToSafePlace();
        }
    }

    _getSafeMap() {
        let unsafeLines = [];

        this.enemies.forEach(({x, y}) => {
            const obstacles = this._findClosestObstacle(x, y);

            const leftLine = x <= 0 ? null : new Vector(obstacles.left, {x: x - 1, y});
            const rightLine = x >= this.gameMapSize[0] - 1 ? null : new Vector({x: x + 1, y}, obstacles.right);
            const topLine = y <= 0 ? null : new Vector(obstacles.up, {x, y: y - 1});
            const bottomLine = y >= this.gameMapSize[1] - 1 ? null : new Vector({x, y: y + 1}, obstacles.down);

            unsafeLines = unsafeLines.concat([leftLine, rightLine, topLine, bottomLine].filter(l => l));
        });

        let unsafeTiles = {};

        unsafeLines.forEach(vector => {
            vector.getTiles().forEach(tile => unsafeTiles[JSON.stringify(tile)] = true);
        });

        unsafeTiles = Object.keys(unsafeTiles).map(key => JSON.parse(key));

        const safeMap = this._gameMap.map((line, i) => line.map((value, j) => {
            for (let k = 0; k < unsafeTiles.length; k++) {
                if (unsafeTiles[k].x === j && unsafeTiles[k].y === i) {
                    unsafeTiles.splice(k, 1);

                    return {value, isSafe: false, x: j, y: i};
                }
            }

            return {value, isSafe: true, x: j, y: i};
        }));

        // todo: не все unsafeTiles удаляются (? дублирование в hashmap-е)

        return safeMap;
    }

    _findClosestObstacle(x, y, dir) {
        switch (dir) {
            case 'left':
                for (let i = x - 1; i >= 0; i--) {
                    if (this._gameMap[y][i] === 1) {
                        return {x: i + 1, y};
                    }
                }

                return {x: 0, y};
            case 'right':
                for (let i = x + 1; i < this.gameMapSize[0]; i++) {
                    if (this._gameMap[y][i] === 1) {
                        return {x: i - 1, y};
                    }
                }

                return {x: this.gameMapSize[0] - 1, y};
            case 'up':
                for (let i = y - 1; i >= 0; i--) {
                    if (this._gameMap[i][x] === 1) {
                        return {x, y: i + 1};
                    }
                }

                return {x, y: 0};
            case 'down':
                for (let i = y + 1; i < this.gameMapSize[1]; i++) {
                    if (this._gameMap[i][x] === 1) {
                        return {x, y: i - 1};
                    }
                }

                return {x, y: this.gameMapSize[1] - 1};
            default:
                return {
                    left: this._findClosestObstacle(x, y, 'left'),
                    right: this._findClosestObstacle(x, y, 'right'),
                    up: this._findClosestObstacle(x, y, 'up'),
                    down: this._findClosestObstacle(x, y, 'down')
                };
        }
    }

    _limitInteger(int) {
        // todo: WARNING: works only with square size maps
        if (int < 0) {
            return 0;
        } else if (int >= this.gameMapSize[0]) {
            return this.gameMapSize[0] - 1;
        }

        return int;
    }

    _isIntegerInLimit(int) {
        return int >= 0 && int < this.gameMapSize[0];
    }

    _travelToSafePlace() {
        const closestObstacle = this._findClosestBy(this.myPosition.x, this.myPosition.y, ({x, y}) => {
            return this._safeMap[y][x].value === 1;
        });
        const closestSafeToObstacle = this._findClosestBy(closestObstacle.x, closestObstacle.y, ({x, y}) => {
            return this._safeMap[y][x].isSafe;
        });

        if (this.myPosition.x < closestSafeToObstacle.x) {
            this.left();
        } else if (this.myPosition.x > closestSafeToObstacle.x) {
            this.right();
        } else if (this.myPosition.y < closestSafeToObstacle.y) {
            this.up();
        } else if (this.myPosition.y > closestSafeToObstacle.y) {
            this.down();
        } else {
            this.sleep();
        }
    }

    _findClosestBy(x, y, fn) {
        let r = 1;

        while (true) {
            for (let i = -r; i <= r; i++) {
                const x_ = x + i;
                const y_ = y - r;
                const y__ = y + r;

                if (this._isIntegerInLimit(x_) && this._isIntegerInLimit(y_) && fn({x: x_, y: y_})) {
                    return {x: x_, y: y_};
                }
                if (this._isIntegerInLimit(x_) && this._isIntegerInLimit(y__) && fn({x: x_, y: y__})) {
                    return {x: x_, y: y__};
                }

                if (i === -r || i === r) {
                    for (let j = -r + 1; j < r; j++) {
                        const y___ = y + j;

                        if (this._isIntegerInLimit(i) && this._isIntegerInLimit(y___) && fn({x: i, y: y___})) {
                            return {x: x_, y: y___};
                        }
                    }
                }
            }

            r++;
        }
    }
}
