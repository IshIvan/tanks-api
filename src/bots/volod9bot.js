import {
	Bot
} from "../playground/bot";
import {
	ACTIONS
} from "../playground/config/actions";

export class Volod9 extends Bot {
	constructor() {
		super();

		this.name = 'Уборщик мусора'
	}

	doStep() {
		let myPosition = this.myPosition;
		let allFires = this.fires;
		let enemies = this.enemies;
		let gameMapSize = this.gameMapSize;
		let dodge = this.dodge(myPosition, allFires, enemies);
		if (!dodge) {
			let result = this.checkDistanceEnemies(myPosition, enemies);
			let switchMapShot = {
				0: ACTIONS.left,
				1: ACTIONS.up,
				2: ACTIONS.right,
				3: ACTIONS.down
			}
			if (result.shot) {
				this.fire(switchMapShot[result.action]);
			}
		}
	}

	checkDistanceEnemies(myPosition, enemies) {
		for (let i = 0; i < enemies.length; i++) {
			if (myPosition.y == enemies[i].location.y && (myPosition.x - enemies[i].location.x) < 3 && (myPosition.x - enemies[i].location.x) > 0) {
				return {
					shot: true,
					action: 0
				};
			} else if (myPosition.y == enemies[i].location.y && (myPosition.x - enemies[i].location.x) > -3 && (myPosition.x - enemies[i].location.x) < 0) {
				return {
					shot: true,
					action: 2
				};
			} else if (myPosition.x == enemies[i].location.x && (myPosition.y - enemies[i].location.y) < 3 && (myPosition.y - enemies[i].location.y) > 0) {
				return {
					shot: true,
					action: 1
				};
			} else if (myPosition.x == enemies[i].location.x && (myPosition.y - enemies[i].location.y) > -3 && (myPosition.y - enemies[i].location.y) < 0) {
				return {
					shot: true,
					action: 3
				};
			}
		}

		return {
			shot: false
		};
	}

	dodge(myPosition, allFires) {
		let allFiresDistance = [];
		allFires.forEach(fire => {
			let result = this.checkDistanceFire(myPosition, fire);
			if (result) {
				allFiresDistance.push(result);
			}
		});
		let allFiresDistanceLength = allFiresDistance.length;
		if (allFiresDistanceLength) {
			let minIndex = 0;
			for (let i = 0; i < allFiresDistanceLength; i++) {
				if (allFiresDistance[minIndex] > allFiresDistance[i]) {
					minIndex = i;
				}
			}
			if (allFiresDistance[minIndex].distance > 0) {
				this.move(allFiresDistance[minIndex].position, allFiresDistance[minIndex].vector);
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	move(position, vector) {
		let vectorSwitchMap = {
			1: this.down(),
			2: this.left(),
			3: this.up(),
			0: this.right()
		}

		switch (position) {
			case 'x':
				if (this.canIDoMoveAction(ACTIONS.right)) {
					this.right();
				} else if (this.canIDoMoveAction(ACTIONS.left)) {
					this.left();
				} else {
					vectorSwitchMap[vector];
				}
				break;
			case 'y':
				if (this.canIDoMoveAction(ACTIONS.up)) {
					this.up();
				} else if (this.canIDoMoveAction(ACTIONS.down)) {
					this.down();
				} else {
					vectorSwitchMap[vector];
				}
				break;
		}
	}

	checkDistanceFire(myPosition, fire) {
		if (
			(myPosition.x == fire.position.x) &&
			(
				(
					(myPosition.y - fire.position.y) > 0 && fire.vector == 3) ||
				((myPosition.y - fire.position.y) < 0 && fire.vector == 1)
			)
		) {
			return {
				position: 'x',
				distance: Math.abs(myPosition.y - fire.position.y),
				vector: fire.vector
			};
		} else if (
			(myPosition.y == fire.position.y) &&
			(
				(
					(myPosition.x - fire.position.x) > 0 && fire.vector == 2) ||
				((myPosition.x - fire.position.x) < 0 && fire.vector == 0)
			)
		) {
			return {
				position: 'y',
				distance: Math.abs(myPosition.x - fire.position.x),
				vector: fire.vector
			};
		} else {
			return false;
		}
	}
}