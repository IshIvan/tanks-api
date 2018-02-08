import React, {Component} from 'react';
import './App.css';
import {Ground} from "./ground/Ground";
import {Player} from "./player/Player";
import {Playground} from "./playground/playground";
import {Fire} from "./fire/Fire";
import {Score} from "./score/Score";

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
        const isLive = this.playground.isBotLiveByIndex(ind);
        return <Player imgStyle={player.style.imgStyle}
                       action={action}
                       live={isLive}
                       key={ind}
                       top={pos.y}
                       left={pos.x}/>
    }

    /**
     * Формируем элемент выстрела.
     */
    getFireNode(fire) {
        const {x, y} = fire.position;
        return <Fire key={fire.id}
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
                <Ground map={this.playground.immutableMap}/>
                {this.state.players.map(this.getPlayerNode.bind(this))}
                {this.state.fires.map(this.getFireNode.bind(this))}
                <Score/>
            </div>
        );
    }
}

export default App;
