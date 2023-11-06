/* eslint-disable no-undef */
import { socketEvents } from './config.js';

export function createSprite(char, phaserCtx, { x, y, isFlip }) {
	const state = char;
	const phaser = phaserCtx;
	const sprite = phaser.add.sprite(x, y).setInteractive();
	let enableSkillAction = false;

	const event = {
		skill: null,
		target: null
	};

	sprite.setFlipX(isFlip);

	const skillSelected = (skillId) => {
		const skill = state.skills.find(s => s.id === skillId);
		console.log(skill);
		if (!skill) throw new Error('Skill not found');

		enableSkillAction = true;
		event.skill 			= skill;
	};

	const targetSelected = (target) => {
		event.target = target;
		if (!event.skill || !event.target) throw new Error('Invalid Action');
	};

	const emitEvent = (socket) => {
		socket.emit(socketEvents.charAction, {
			skillId: event.skill.id,
			target: event.target
		});

		sprite.x = 400;
		sprite.play('action1');

		sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
			sprite.x = 200;
			sprite.play('idle');
		});

		event.skill  = null;
		event.target = null;
	};

	const update = () => {
		return {
			enableSkillAction
		};
	};

	const createAnims = () => {
		state.anims.forEach(anim => {
			phaser.anims.create({
				key: anim.key,
				frameRate: anim.frameRate,
				repeat: anim.repeat ? -1 : 0,
				frames: phaser.anims.generateFrameNames(state.key, {
					prefix: anim.prefix,
					suffix: anim.suffix,
					end: anim.end,
					zeroPad: anim.zeroPad
				}),
			});
		});

		sprite.play('idle');
	};

	createAnims();

	return {
		...state,
		sprite,
		enableSkillAction,
		skillSelected,
		targetSelected,
		update,
		emitEvent
	};
}

export function createSpriteDemo(character, game, { x, y, isFlip }) {
	const char	 = character;
	const phaser = game;
	const sprite = phaser.add.sprite(x, y, 'cap', 'attack_A/frame0000').setInteractive();
	const event = {
		skillId: null,
		targetId: null
	};
		
	sprite.setFlipX(isFlip);

	const skillSelected = (skillId) => {
		console.log('skill', skillId);
		event.skillId = skillId;
	};

	const targetSelected = (target) => {
		if (event.skillId) {
			console.log('target', target);
			event.targetId = target;

			// emit // logic
			event.skillId = null;
			event.targetId = null;

			// back-end 
			// check skill and target
			// checar se skill é do currentChar
			// verificar se nesse round o personagem já jogou.
		}
	};

	const emitEvent = (socket) => {
		socket.emit('EXECUTE_ACTION', {
			...event
		});
	};

	return {
		...char,
		sprite,
		skillSelected,
		targetSelected,
		emitEvent
	};
}