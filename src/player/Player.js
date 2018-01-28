import React, {Component} from 'react';
import "./Player.css";

export class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {
                top: 0,
                left: 0
            }
        };
    }

    /**
     * Установить позицию игрока.
     */
    setPosition(top, left) {
        this.setState({style: {top, left}})
    }

    /**
     * Установим новое состояние.
     * Для абсолютного позиционирования.
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            style: {
                nextProps
            }
        });
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