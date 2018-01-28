import React, { Component } from 'react';
import {Cell} from "../cell/Cell";
import "./Column.css";
import {Barricade} from "../barricade/Barricade";

export class Column extends Component {
    render() {
        const types = this.props.column;
        return (
            <div className="Column">
                {types.map((type, ind) => type ? <Barricade key={ind}/> : <Cell key={ind}/> )}
            </div>
        );
    }
}