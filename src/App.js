import React, {Component} from 'react';
import './App.css';
import {Ground} from "./ground/Ground";
import {Player} from "./player/Player";
import {Playground} from "./playground/playground";

class App extends Component {
    constructor() {
        super();
        this.state = {
            players: []
        };
        this.initPlayground();
    }

    /**
     * Создаем игровой контроллер.
     * Подписываемся на него.
     */
    initPlayground() {
        this.playground = new Playground();
        this.playground
            .stepper$
            .subscribe(this.setPlayers.bind(this));
    }

    componentWillMount() {
        this.setPlayers();
    }

    /**
     * Получаем элемент игрока.
     */
    getPlayerNode(player, ind) {
        const pos = player.myPosition;
        return <Player controller={player}
                       key={ind}
                       top={pos.y}
                       left={pos.x}/>
    }

    /**
     * Записываем игроков в состояние.
     */
    setPlayers() {
        this.setState({
            players: this.playground.players
        })
    }

    render() {
        return (
            <div className="App">
                <Ground playground={this.playground}/>
                {this.state.players.map((player, ind) => this.getPlayerNode(player, ind))}
            </div>
        );
    }
}

export default App;
