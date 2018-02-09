import React, {Component} from 'react';
import './Score.css';
import {STATUSES} from "../playground/config/statuses";

class ScoreItem extends Component {
    render() {
        const {imgStyle} = this.props.style;
        const color = imgStyle.backgroundColor;
        return <div className="Score-Item"
                    style={{color}}>
            <div className="Text">Игрок: {this.props.children}</div>
            <div className="Text">Счет: {this.props.score}</div>
            <div className="Text">Статус: {this.props.status === STATUSES.live ? 'ЖИВ' : 'МЕРТВ'}</div>
        </div>
    }
}

export class Score extends Component {
    render() {
        return <div className="Score">
            <div className="Score-Header">Счет по танчикам:</div>
            <div className="Score-Table">
                {this.props.players.map((player, ind) => <ScoreItem key={ind}
                                                                    style={player.style}
                                                                    score={this.props.points[ind]}
                                                                    status={this.props.statuses[ind]}
                >{player.name}</ScoreItem>)}
            </div>
        </div>
    }
}