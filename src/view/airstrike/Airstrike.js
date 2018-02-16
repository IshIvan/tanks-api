import React, {Component, Fragment} from 'react';
import './Airstrike.css';
import {CELL_SIZE} from "../../player/Player";

export class AirStrike extends Component {
    /**
     * Стилизация красной зоны
     */
    stylize() {
        const {strike} = this.props;
        return {
            left: strike.topLeft.x * CELL_SIZE,
            top: strike.topLeft.y * CELL_SIZE,
            width: (strike.bottomRight.x - strike.topLeft.x) * CELL_SIZE,
            height: (strike.bottomRight.y - strike.topLeft.y) * CELL_SIZE
        };
    }

    /**
     * Стилизация текста таймера.
     */
    textStylize() {
        const {strike} = this.props;
        return {
            left: 0.5 * (strike.bottomRight.x + strike.topLeft.x) * CELL_SIZE,
            top: 0.5 * (strike.bottomRight.y + strike.topLeft.y) * CELL_SIZE
        };
    }

    render() {
        const style = this.stylize();
        const textStyle = this.textStylize();
        return (
            <Fragment>
                <div className="AirStrike"
                     style={style}>
                </div>
                <div className="AirStrike-counter"
                     style={textStyle}>{this.props.strike.counter}</div>
            </Fragment>
        );
    }
}