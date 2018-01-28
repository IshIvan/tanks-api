import React, {Component} from 'react';
import './App.css';
import {Ground} from "./ground/Ground";
import {Player} from "./player/Player";

class App extends Component {
    render() {
        return (
            <div className="App">
                <Ground/>
                <Player/>
            </div>
        );
    }
}

export default App;
