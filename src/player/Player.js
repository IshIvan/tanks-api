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
            },
            imgStyle: {},
            isLive: true
        };
    }

    componentWillMount() {
        this.setPosition(this.props.top, this.props.left);
        this.setLive(this.props.live);
    }

    setLive(isLive) {
        this.setState({isLive});
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
     * Устанавливаем стили подложке бота.
     */
    setImgStyle(imgStyle) {
        this.setState({imgStyle});
    }

    /**
     * Установим новое состояние.
     * Для абсолютного позиционирования.
     */
    componentWillReceiveProps(nextProps) {
        this.setPosition(nextProps.top, nextProps.left);
        this.setLive(this.props.live);
        this.setImgStyle(this.props.imgStyle);
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

    get isLiveClass() {
        return this.state.isLive ? 'live' : 'dead';
    }

    render() {
        const {action} = this.props;
        const className =
            `Player Player-img_rotate_${Player.getRotateClassName(action)} Player-img_${this.isLiveClass}`;
        return (
            <div className={className}
                 style={this.state.style}
            >
                <div className="Player-img" style={this.state.imgStyle}></div>
                <div className="Player-name">{this.props.name}</div>
            </div>
        );
    }
}