import crypto from 'node:crypto';
import { Skill } from './Skill';

interface Attrs {
  health: number;
  stamina: number;
  speed: number;
}

interface Anims {
	repeat: boolean;
	frameRate: number;
	prefix: string;
	suffix: string;
	end: number;
	zeroPad: number;
	key: string;
}

export class Character {
	private id: string;
	public name: string;
	private level: number;
	public key: string;
	public playerId: string;
	public attrs: Attrs;
	private skills: Skill[];
	public anims: Anims[];

	constructor(name: string, playerId: string, attrs: Attrs, anims: Anims[], skills: Skill[]) {
		this.id = crypto.randomUUID();
		this.name = name;
		this.level = 1;
		this.playerId = playerId;
		this.attrs = { ...attrs };
		this.skills = skills;
		this.anims = anims;
		this.key = 'cap';
	}

	private checkAvailableSkills() {
		this.skills.forEach(skill => {
			if (this.attrs.stamina < skill.getCost()) {
				skill.setBlocked(true);
			} else {
				skill.setBlocked(false);
			}
		});
	}

	public getSkills() {
		return this.skills;
	}

	public rechargeStamina() {
		this.attrs.stamina += 10; 
	}

	public getId() {
		return this.id;
	}
}