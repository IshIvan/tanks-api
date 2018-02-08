import React, { Component } from 'react';
import {Cell} from "../cell/Cell";
import "./Column.css";
import {Barricade} from "../barricade/Barricade";
import {CELL_TYPES} from "../playground/config/cell-types";

export class Column extends Component {
    static getNode(type, ind) {
        switch (type) {
            case CELL_TYPES.ground:
                return <Cell key={ind}/>;
            case CELL_TYPES.barricade:
                return <Barricade key={ind}/>;
            default:
                return <Cell key={ind}/>;
        }
    }

    render() {
        const types = this.props.column;
        return (
            <div className="Column">
                {types.map(Column.getNode.bind(this))}
            </div>
        );
    }
}