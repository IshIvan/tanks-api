import {config} from "../../api-config";

export class AirStrikeModel {
    constructor({x0, y0, radius}) {
        this.center = {
            x: x0,
            y: y0
        };
        this._generate(radius);
        this.counter = radius;
    }

    /**
     * Создаем левый верхний и правый нижний угол.
     */
    _generate(radius) {
        this.leftAngle = {
          x: Math.max(this.center.x - radius, 0),
          y: Math.max(this.center.y - radius, 0)
        };
        this.rightAngle = {
            x: Math.min(this.center.x + radius, config.row),
            y: Math.min(this.center.y + radius, config.column)
        }
    }

    /**
     * Счетчик ходов.
     */
    set counter(n) {
        this._counter = n;
    }

    get counter() {
        return this._counter;
    }
}