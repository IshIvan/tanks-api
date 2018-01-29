import React, {Component} from 'react';
import './App.css';
import {Ground} from "./ground/Ground";
import {Player} from "./player/Player";
import {Playground} from "./playground/playground";

class App extends Component {
    constructor() {
        super();
        this.playground = new Playground();
    }

    render() {
        return (
            <div className="App">
                <Ground playground={this.playground}/>
                {this.playground.getPlayers().map((player, ind) => <Player controller={player}
                                                                           key={ind}
                                                                           top={player.myPosition.y}
                                                                           left={player.myPosition.x}/>)}
            </div>
        );
    }
}

export default App;
