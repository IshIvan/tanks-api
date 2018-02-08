import React, {Component} from 'react';
import {Column} from "../column/Column";
import './Ground.css';
import PropTypes from 'prop-types';

export class Ground extends Component {
    render() {
        const {map} = this.props;
        return (
            <div className="Ground">
                {map.map((col, colIndex) => <Column key={colIndex}
                                                         column={col}/>
                )}
            </div>
        );
    }
}

Ground.propTypes = {
    map: PropTypes.array.isRequired
};
