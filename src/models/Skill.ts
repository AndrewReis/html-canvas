import crypto from 'node:crypto';
import { Effect } from './Effect';

export class Skill {
	private id: string;
	private name: string;
	private cost: number;
	private value: number;
	public key: string;
	public type: 'damage' | 'buff' | 'debuff';
	private effect: Effect;
	private blocked: boolean;

	constructor(name: string, effect: Effect) {
		this.id = crypto.randomUUID();
		this.name = name;
		this.key = 'cap';
		this.cost = 50;
		this.value = 5;
		this.type = 'damage';
		this.effect = effect;
		this.blocked = false;
	}

	public setBlocked(isBlock: boolean) {
		this.blocked = isBlock;
	}

	public getBlocked() {
		return this.blocked;
	}

	public getId() {
		return this.id;
	}

	public getName() {
		return this.name;
	}

	public getEffect() {
		return this.effect;
	}

	public getValue() {
		return this.value;
	}

	public getType() {
		return this.type;
	}

	public getCost() {
		return this.cost;
	}
}