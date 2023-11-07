/* eslint-disable @typescript-eslint/no-unused-vars */
import crypto from 'node:crypto';
import { ICharacter, IPlayer, ISkill } from 'src/types';

interface State {
	players: {
		user: IPlayer,
		adversary: IPlayer
	};
	gameOver: {
		isOver: boolean,
		winner: string
	},
	allChars: ICharacter[];
	skillsBlocked: ISkill[],
	currentChar: ICharacter;
	previusChar: ICharacter | null;
	currentCharIndex: number;
	round: number;
	orderChars: boolean;
	iaCommands: {
		isRecharge: boolean,
		event: {
			targetId: string,
			skillId: string | undefined
		}
	}
}

class IA {
	private character: ICharacter = {} as ICharacter;

	public execute() {
		console.log('eaii');
	}

	public setCurrentChar(char: ICharacter) {
		this.character = char;
	}

	public choosenAction(chars: ICharacter[]) {
		const target = chars.find(c => c.attrs.health > 0);

		if (!target) throw new Error('GAME OVER!!! IA Venceu');

		const skill = this.character.skills.find(s => !s.blocked);

		const command = {
			isRecharge: !skill,
			event: {
				targetId: target.id,
				skillId: skill?.id
			}
		};
		
		return command;
	}
}

export class Battle {
	private id: string;
	private state: State;
	private ia: IA;

	constructor(user: IPlayer, adversary: IPlayer) {
		this.id = crypto.randomUUID();
		this.ia = new IA();

		this.state = {
			players: {
				user: user,
				adversary: adversary
			},
			gameOver: {
				isOver: false,
				winner: ''
			},
			round: 1,
			currentCharIndex: 0,
			previusChar: null,
			currentChar: {} as ICharacter,
			orderChars: false,
			allChars: [ ...user.team, ...adversary.team ],
			skillsBlocked: [],
			iaCommands: {
				isRecharge: false,
				event: {
					skillId: '',
					targetId: ''
				}
			}
		};

		this.state.currentChar = this.state.allChars[this.state.currentCharIndex];
	}

	// 0
	public init() {
		this.orderedCharsByVelocity();
		this.setCurrentChar();
	}

	// 0
	public getState() {
		const isUserChar = this.state.players.user.team.some(char => char.id === this.state.currentChar?.id);
		const currentChar = isUserChar ? this.state.currentChar : { id: this.state.currentChar.id, name: this.state.currentChar.name, attrs: this.state.currentChar.attrs };
		return {
			// allChars: this.state.allChars,
			// previusChar: this.state.previusChar,
			// round: this.state.round,
			...this.state,
			currentChar: currentChar,
			userTeam: this.state.players.user.team,
			adversaryTeam: this.state.players.adversary.team
		};
	}

	// 0
	public execute(skillId: string, targetId: string) {
		this.checkSkillsAvailables();
		
		const character = this.getCurrentCharacter();
		
		const target = this.state.allChars.find(char => char.id === targetId);
		const skill  = character.skills.find(s => s.id === skillId);

		if (target && skill) {
			const skillAvailable = this.state.skillsBlocked.some(skillBlocked => skillBlocked.id === skill.id);
			if (!skillAvailable) {
				if (skill.type === 'damage') {
					target.attrs.health -= skill.value;
					character.attrs.stamina -= skill.cost;
				}
		
				if (target.attrs.health <= 0) {
					// this.state.orderChars = true;
					this.state.allChars = this.state.allChars.filter(c => c.id !== target.id);
		
					this.state.allChars.forEach((c, i) => {
						if (c.id === character.id) {
							this.state.currentCharIndex = i + 1;
						}
					});
				} 
				// else {
				// 	this.state.orderChars = false;
				// }
				this.nextTurn();
				this.setCurrentChar();
				return;
			}
		}

		this.rechargeStamina();
		this.nextTurn();
		this.setCurrentChar();
	}

	// 1
	public rechargeStamina() {
		const character = this.getCurrentCharacter();

		if (character.attrs.stamina < 100) {
			character.attrs.stamina += 20;
		}

		if (character.attrs.stamina >= 100) {
			character.attrs.stamina = 100;
		}
	}

	// 1
	private checkSkillsAvailables() {
		const character = this.getCurrentCharacter();
		if (character) {
			character.skills.forEach(charSkill => {
				if (character.attrs.stamina < charSkill.cost) {
					charSkill.blocked = true;
					const skilAlreadyRegister = this.state.skillsBlocked.some(skillBlocked => skillBlocked.id === charSkill.id);
					if(!skilAlreadyRegister) {
						this.state.skillsBlocked.push(charSkill);
					}
				} else {
					charSkill.blocked = false;
					this.state.skillsBlocked = this.state.skillsBlocked.filter(skillBlocked => skillBlocked.id !== charSkill.id);
				}
			});
		}
	}

	// 1
	private orderedCharsByVelocity() {
		this.state.allChars.sort((a, b) => b.attrs.speed - a.attrs.speed);
	}

	// 4
	public getCurrentCharacter() {
		return this.state.allChars[this.state.currentCharIndex];
	}

	// 3
	private setCurrentChar() {
		this.state.currentChar = this.state.allChars[this.state.currentCharIndex];
	}

	// 0
	public checkIATurn() {
		const character = this.getCurrentCharacter();
		if (!character) throw new Error('Character not found');

		const adversaryChar = this.state.players.adversary.team.find(char => char.id === character.id);

		if (adversaryChar) {
			this.ia.setCurrentChar(character);
			this.state.iaCommands = this.ia.choosenAction(this.state.players.user.team);

			return this.state.iaCommands;
		}
	}

	// 2
	private nextTurn() {
		// const adversaryChar = this.state.players.adversary.team.some(char => char.id === this.state.allChars[this.state.currentCharIndex].id);

		// if (!this.state.orderChars) {
		// }
			
		this.state.currentCharIndex++;

		if(this.state.currentCharIndex >= this.state.allChars.length) {
			this.state.currentCharIndex = 0;
			this.state.round++;
		}
	}

	// 0
	public checkGameIsOver() {
		const userTeam: ICharacter[] 			= [];
		const adversaryTeam: ICharacter[] = [];

		for (const char of this.state.allChars) {

			for (const userChar of this.state.players.user.team) {
				if (char.id === userChar.id) {
					userTeam.push(char);
				}
			}

			for (const adversaryChar of this.state.players.adversary.team) {
				if (char.id === adversaryChar.id) {
					adversaryTeam.push(char);
				}
			}
		}

		if (userTeam.length === 0 && adversaryTeam.length === 0) {
			console.log('GAME OVER -> EMPATE!');
			this.state.gameOver.isOver = true;
			this.state.gameOver.winner = 'EMPATE';
		} else if (userTeam.length === 0) {
			this.state.gameOver.isOver = true;
			this.state.gameOver.winner = 'IA';
		} else if (adversaryTeam.length === 0) {
			this.state.gameOver.isOver = true;
			this.state.gameOver.winner = 'USER';
		} else {
			this.state.gameOver.isOver = false;
			this.state.gameOver.winner = '';
		}

		if (this.state.gameOver.isOver) {
			throw new Error(this.state.gameOver.winner);
		}
	}
}