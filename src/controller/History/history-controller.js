import {ACTIONS} from "../../playground/config/actions";
import {Step} from "../../model/common/step";

export class HistoryController {
    /**
     * Создаем массив шагов.
     */
    initHistory(botNumber) {
        this.history = new Array(botNumber).fill(0);
        this.history = this.history.map(_ => []);
    }

    /**
     * Добавляем шаг по движению бота.
     */
    addMoveStep(ind, type, movedTo) {
        this.history[ind].push(new Step({type, movedTo}));
    }

    /**
     * Добавляем выстрел бота.
     */
    addFireStep(ind, fire) {
        const type = ACTIONS.fire;
        this.history[ind].push(new Step({type, fire}));
    }

    /**
     * Получаем историю по индексу бота.
     */
    getHistoryByIndex(ind) {
        return this.history[ind];
    }

    /**
     * Получаем последний ход по индексу бота.
     */
    getLastStepByBotIndex(ind) {
        const h = this.history[ind];
        return h[h.length - 1];
    }
}