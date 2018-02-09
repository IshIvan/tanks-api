import React, {Component} from 'react';
import './Score.css';

class ScoreItem extends Component {
    render() {
        const {imgStyle} = this.props.style;
        const color = imgStyle.backgroundColor;
        return <div className="Score-Item"
                    style={{color}}>
            {this.props.children} {this.props.score}</div>
    }
}

export class Score extends Component {
    render() {
        return <div className="Score">
            <div className="Score-Header">Счет по танчикам:</div>
            {this.props.players.map((player, ind) => <ScoreItem key={ind}
                                                                style={player.style}
                                                                score={this.props.points[ind]}
            >{player.name}</ScoreItem>)}
        </div>
    }
}