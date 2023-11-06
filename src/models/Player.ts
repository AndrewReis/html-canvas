import { Character } from './Character';

export class Player {
	private id: string;
	public name: string;
	private team: Character[];

	constructor(id: string, name: string) {
		this.id = id;
		this.name = name;
		this.team = [];
	}

	public getId() {
		return this.id;
	}

	public getName() {
		return this.name;
	}

	public setTeam(characters: Character[]) {
		this.team = characters;
	}

	public getTeam() {
		return this.team;
	}
}