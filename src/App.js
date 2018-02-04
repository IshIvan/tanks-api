import React, {Component} from 'react';
import './App.css';
import {Ground} from "./ground/Ground";
import {Player} from "./player/Player";
import {Playground} from "./playground/playground";
import {Fire} from "./fire/Fire";

class App extends Component {
    constructor() {
        super();
        this.state = {
            players: [],
            fires: []
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
            .subscribe(this.setStepProps.bind(this));
    }

    componentWillMount() {
        this.setStepProps();
    }

    /**
     * Получаем элемент игрока.
     */
    getPlayerNode(player, ind) {
        const pos = player.myPosition;
        const action = this.playground.getStepByBotIndex(ind);
        return <Player action={action}
                       key={ind}
                       top={pos.y}
                       left={pos.x}/>
    }

    getFireNode(fire, ind) {
        const {x, y} = fire.position;
        return <Fire key={ind}
                     top={y}
                     left={x}/>
    }

    /**
     * Записываем игроков в состояние.
     */
    setStepProps() {
        this.setState({
            players: this.playground.players,
            fires: this.playground.fires
        })
    }

    render() {
        return (
            <div className="App">
                <Ground playground={this.playground}/>
                {this.state.players.map((player, ind) => this.getPlayerNode(player, ind))}
                {this.state.fires.map((fire, ind) => this.getFireNode(fire, ind))}
            </div>
        );
    }
}

export default App;
