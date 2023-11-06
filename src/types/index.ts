export interface IAnims {
	repeat: boolean;
	frameRate: number;
	prefix: string;
	suffix: string;
	end: number;
	zeroPad: number;
	key: string;
}

export interface ISkill {
	id: string;
	name: string;
	cost: number;
	value: number;
	key: string;
	charId: string;
	type: 'damage' | 'buff' | 'debuff';
	blocked: boolean;
}

export interface IAttrs {
  health: number;
  stamina: number;
  speed: number;
}

export interface ICharacter {
	id: string;
	name: string;
	// playerId: string;
	// anims: IAnims[];
	attrs: IAttrs;
	skills: ISkill[];
}

export interface IPlayer {
	id: string;
	name: string;
	team: ICharacter[]
}