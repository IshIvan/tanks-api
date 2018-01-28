import React, {Component} from 'react';
import {Column} from "../column/Column";
import './Ground.css';
import PropTypes from 'prop-types';

export class Ground extends Component {
    render() {
        const pl = this.props.playground;
        return (
            <div className="Ground">
                {pl._maps.map((col, colIndex) => <Column key={colIndex}
                                                         column={pl.getRow(colIndex)}/>
                )}
            </div>
        );
    }
}

Ground.propTypes = {
    playground: PropTypes.object.isRequired
};
