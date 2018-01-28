import React, {Component} from 'react';
import {Column} from "../column/Column";
import './Ground.css';
import {Playground} from "../playground/Playground";

export class Ground extends Component {
    render() {
        const pl = new Playground();
        return (
            <div className="Ground">
                {pl._maps.map((col, colIndex) => <Column key={colIndex}
                                                         column={pl.getRow(colIndex)}
                />)}
            </div>
        );
    }
}