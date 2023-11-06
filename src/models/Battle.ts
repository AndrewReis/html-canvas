import crypto from 'node:crypto';
import { ICharacter, IPlayer } from 'src/types';

interface State {
	players: {
		user: IPlayer,
		adversary: IPlayer
	};
	allChars: ICharacter[];
	currentChar: ICharacter | null;
	previusChar: ICharacter | null;
	currentCharIndex: number;
	round: number;
	orderChars: boolean
}

export class Battle {
	private id: string;
	private state: State;

	constructor(user: IPlayer, adversary: IPlayer) {
		this.id = crypto.randomUUID();

		this.state = {
			players: {
				user: user,
				adversary: adversary
			},
			round: 1,
			currentCharIndex: 0,
			previusChar: null,
			currentChar: null,
			orderChars: false,
			allChars: [ ...user.team, ...adversary.team ]
		};
	}

	public init() {
		console.log('INIT BATTLE');
		this.orderedCharsByVelocity();
		this.setCurrentChar();
	}

	public getState() {
		if (!this.state.currentChar) throw new Error('Char not found');
		
		const isUserChar = this.state.players.user.team.some(char => char.id === this.state.currentChar?.id);
		const currentChar = isUserChar ? this.state.currentChar : { id: this.state.currentChar.id, name: this.state.currentChar.name, attrs: this.state.currentChar.attrs };

		return {
			allChars: this.state.allChars,
			currentChar: currentChar,
			previusChar: this.state.previusChar,
			round: this.state.round,
			userTeam: this.state.players.user.team,
			adversaryTeam: this.state.players.adversary.team
		};
	}

	// public execute(skillId: string, target: ICharacter) {
	// 	const character = this.getCurrentCharacter();

	// 	if (character.playerId === this.state.players.user.id) {
	// 		character.skills.map(s => console.log(s.id));
	// 	} else {
	// 		console.log('ia');
	// 	}
	// }

	private orderedCharsByVelocity() {
		this.state.allChars.sort((a, b) => b.attrs.speed - a.attrs.speed);
	}

	private getCurrentCharacter() {
		return this.state.allChars[this.state.currentCharIndex];
	}

	private setCurrentChar() {
		this.state.currentChar = this.state.allChars[this.state.currentCharIndex];
	}

	// private nextTurn() {
	// 	const character = this.getCurrentCharacter();

	// 	if (!character) throw new Error('Character not found');

	// 	if (!this.state.orderChars || character.playerId === this.state.players.adversary.id) {
	// 		this.state.currentCharIndex++;
	// 	}

	// 	if(this.state.currentCharIndex >= this.state.allChars.length) {
	// 		this.state.currentCharIndex = 0;
	// 		this.state.round++;
	// 	}
	// }
}