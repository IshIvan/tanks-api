import React, {Component} from 'react';
import './Fire.css';
import {CELL_SIZE} from "../player/Player";

export class Fire extends Component {
    constructor() {
        super();
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
     * Установим новое состояние.
     * Для абсолютного позиционирования.
     */
    componentWillReceiveProps(nextProps) {
        this.setPosition(nextProps.top, nextProps.left);
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

    render() {
        return <div className="Fire"
                    style={this.state.style}> </div>
    }
}