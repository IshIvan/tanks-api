import React, {Component} from 'react';
import './App.css';
import {Ground} from "./ground/Ground";
import {Player} from "./player/Player";
import {Playground} from "./playground/playground";
import {Fire} from "./fire/Fire";
import {Score} from "./score/Score";
import {AirStrike} from "./view/airstrike/Airstrike";
import {Winner} from "./view/Winner/Winner";

class App extends Component {
    constructor() {
        super();
        this.state = {
            players: [],
            fires: [],
            winner: null
        };
        this.initPlayground();
    }

    /**
     * Создаем элемент красной зоны.
     */
    get strikeNode() {
        const {strike} = this.playground;
        return strike !== null
            ? <AirStrike strike={strike}/>
            : null;
    }

    /**
     * Создаем элемент информации о победителе.
     */
    get winnerNode() {
        const {winner} = this.state;
        return winner
            ? <Winner winner={winner}/>
            : null;
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
        this.playground
            .winner$
            .subscribe(this.setWinner.bind(this));
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
                       name={player.name}
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

    /**
     * Записываем победителя в состояние.
     */
    setWinner(winner) {
        this.setState({winner});
    }

    render() {
        return (
            <div className="App">
                <Ground map={this.playground.immutableMap}/>
                {this.state.players.map(this.getPlayerNode.bind(this))}
                {this.state.fires.map(this.getFireNode.bind(this))}
                {this.strikeNode}
                <Score players={this.playground.players}
                       points={this.playground.points}
                       statuses={this.playground.statuses}/>
                {this.winnerNode}
            </div>
        );
    }
}

export default App;
