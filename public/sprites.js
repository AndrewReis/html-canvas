/* eslint-disable no-undef */
class HealthBar {
	constructor(scene, x, y) {
		this.bar = new Phaser.GameObjects.Graphics(scene);
		this.x = x;
		this.y = y;
		this.value = 100;
		this.p = 76 / 100;
		this.draw();
		scene.add.existing(this.bar);
	}

	decrease(amount) {
		this.value = amount;
		if (this.value < 0) {
			this.value = 0;
		}
		this.draw();
		return (this.value === 0);
	}

	draw() {
		this.bar.clear();
		this.bar.fillStyle(0xffffff);
		this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);

		if (this.value < 30) {
			this.bar.fillStyle(0xff0000);
		} else {
			this.bar.fillStyle(0x00ff00);
		}

		var d = Math.floor(this.p * this.value);
		this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
	}
}

class StaminaBar {
	constructor(scene, x, y) {
		this.bar = new Phaser.GameObjects.Graphics(scene);
		this.x = x;
		this.y = y;
		this.value = 100;
		this.p = 76 / 100;
		this.draw();
		scene.add.existing(this.bar);
	}

	decrease(amount) {
		this.value = amount;
		if (this.value < 0) {
			this.value = 0;
		}
		this.draw();
		return (this.value === 0);
	}

	draw() {
		this.bar.clear();
		this.bar.fillStyle(0xffffff);
		this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);

		this.bar.fillStyle(0x1984DC);
		var d = Math.floor(this.p * this.value);
		this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
	}
}

export class Sprite extends Phaser.GameObjects.Sprite {
	#event = { skillId: null, targetId: null };
	id = null;
	#char = {};

	constructor(scene, char, { x, y, isFlip }) {
		super(scene, x, y);
		this.#char = char;
		this.id = char.id;
		this.setInteractive();
		this.setTexture('cap');
		this.setPosition(x, y);
		this.setFlipX(isFlip);

		scene.add.existing(this);

		this.hp = new HealthBar(scene, x - 50, y - 70);
		this.stamina = new StaminaBar(scene, x - 50, y - 60);
		scene.add.text(x - 50, y - 80, char.name);
	}

	skillSelected(skillId = '') {
		this.#event.skillId = skillId;
	}

	targetSelected(targetId = '') {
		if (this.#event.skillId) {
			this.#event.targetId = targetId;
		}
	}

	rechargeStamina(socket) {
		socket.emit('RECHARGE_STAMINA', {});
		this.#event.skillId = null;
		this.#event.targetId = null;
	}

	emitEvent(socket) {
		if (this.#event.skillId || this.#event.targetId) {
			socket.emit('EXECUTE_ACTION', {
				...this.#event
			});

			this.#event.skillId = null;
			this.#event.targetId = null;
		}
	}

	updateHealthBar(value) {
		this.hp.decrease(value);
	}

	updateStaminaBar(value) {
		this.stamina.decrease(value);
	}
}
