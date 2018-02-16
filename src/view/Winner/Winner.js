import React from "react";
import './Winner.css';

export class Winner extends React.Component {
    render() {
        const {winner: w} = this.props;
        return <div className="Winner">
            <div className="Winner-List">
                <div className="Winner-ListItem List-Header">Победил</div>
                <div className="Winner-ListItem">{w.name} со счетом {w.score}</div>
            </div>
        </div>
    }
}