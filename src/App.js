import React, {Component} from 'react';
import './App.css';
import {Ground} from "./ground/Ground";
import {Player} from "./player/Player";
import {Playground} from "./playground/playground";

class App extends Component {
    render() {
        const pl = new Playground();
        return (
            <div className="App">
                <Ground playground={pl}/>
                <Player top={500} left={50}/>
            </div>
        );
    }
}

export default App;
