import React, {Component} from 'react';
import "./Player.css";
import {ACTIONS} from "../playground/config/actions";

/**
 * Размер ячейки в px.
 */
export const CELL_SIZE = 50;

export class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {
                left: 0,
                top: 0
            }
        };
    }

    componentWillMount() {
        this.setPosition(this.props.top, this.props.left);
    }

    /**
     * Установить позицию игрока.
     */
    setPosition(top, left) {
        const style = {
            top: top * CELL_SIZE,
            left: left * CELL_SIZE
        };
        this.setState({style})
    }

    /**
     * Установим новое состояние.
     * Для абсолютного позиционирования.
     */
    componentWillReceiveProps(nextProps) {
        this.setPosition(nextProps.top, nextProps.left);
    }

    /**
     * Получаем суфикс названия класса для применение аницаии поворота.
     */
    static getRotateClassName(actionId) {
        for (let prop in ACTIONS) {
            if (ACTIONS.hasOwnProperty(prop)) {
                if (ACTIONS[prop] === actionId) {
                    return prop;
                }
            }
        }

        return 'up';
    }

    render() {
        const {action} = this.props;
        const className = `Player Player-img_rotate_${Player.getRotateClassName(action)}`;
        return (
            <div className={className}
                 style={this.state.style}
            >
                <div className="Player-img"></div>
            </div>
        );
    }
}