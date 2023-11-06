import crypto from 'node:crypto';

export class Effect {
	private id: string;
	public name: string;
	public value: number;
	public duration: number;
	public type: 'buff' | 'debuff';

	constructor(name: string) {
		this.id = crypto.randomUUID();
		this.name = name;
		this.duration = 2;
		this.value = 5;
		this.type = 'buff';
	}
}