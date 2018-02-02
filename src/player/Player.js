import React, {Component} from 'react';
import "./Player.css";

/**
 * Размер ячейки в px.
 */
const CELL_SIZE = 50;

export class Player extends Component {
    constructor(props) {
        super(props);
        this._controller = props.controller;
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
        this._controller = nextProps.controller;
        this.setPosition(nextProps.top, nextProps.left);
    }

    render() {
        return (
            <div className="Player"
                 style={this.state.style}
            >
                <div className="Player-img"></div>
            </div>
        );
    }
}