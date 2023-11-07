import { ICharacter, IPlayer, ISkill } from 'src/types';

const skills: ISkill[] = [
	{ id: '1', name: 'rasengan', cost: 10, value: 10, type: 'damage', key: '', blocked: false, charId: 'naruto-id' },
	{ id: '2', name: 'chute', cost: 10, value: 20, type: 'damage', key: '', blocked: false, charId: 'naruto-id' },
	{ id: '3', name: 'chidori', cost: 50, value: 100, type: 'damage', key: '', blocked: false, charId: 'sasuke-id' },
	{ id: '4', name: 'bola de fogo', cost: 50, value: 20, type: 'damage', key: '', blocked: false, charId: 'sasuke-id' },
	{ id: '5', name: 'espada relampago', cost: 100, value: 20, type: 'damage', key: '', blocked: false, charId: 'kakashi-id' },
	{ id: '6', name: 'invocação', cost: 50, value: 20, type: 'damage', key: '', blocked: false, charId: 'kakashi-id' },
	{ id: '7', name: 'gomu no pistol', cost: 100, value: 20, type: 'damage', key: '', blocked: false, charId: 'luffy-id' },
	{ id: '8', name: 'gomu no stamp', cost: 50, value: 20, type: 'damage', key: '', blocked: false, charId: 'luffy-id' },
];

const naruto: ICharacter = {
	id: 'naruto-id',
	name: 'Naruto',
	attrs: {
		health: 100,
		stamina: 100,
		speed: 5
	},
	skills: skills.filter(s => s.charId === 'naruto-id')
};

const sasuke: ICharacter = {
	id: 'sasuke-id',
	name: 'sasuke',
	attrs: {
		health: 100,
		stamina: 100,
		speed: 6
	},
	skills: skills.filter(s => s.charId === 'sasuke-id')
};

const kakashi: ICharacter = {
	id: 'kakashi-id',
	name: 'kakashi',
	attrs: {
		health: 100,
		stamina: 100,
		speed: 4
	},
	skills: skills.filter(s => s.charId === 'kakashi-id')
};

const luffy: ICharacter = {
	id: 'luffy-id',
	name: 'luffy',
	attrs: {
		health: 100,
		stamina: 100,
		speed: 2
	},
	skills: skills.filter(s => s.charId === 'luffy-id')
};

const player: IPlayer = {
	id: 'playerId',
	name: 'Player name',
	team: [] as ICharacter[]
};

const adversary: IPlayer = {
	id: 'adversaryId',
	name: 'Adversary name',
	team: [] as ICharacter[]
};

player.team.push(naruto);
player.team.push(sasuke);
adversary.team.push(kakashi);
adversary.team.push(luffy);

export {
	player,
	adversary
};