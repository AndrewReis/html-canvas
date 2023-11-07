/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, beforeEach, it, expect } from 'vitest';

import { ICharacter, IPlayer, ISkill } from 'src/types';

import { Battle } from 'src/models/Battle';

const skills: ISkill[] = [
	{ id: '1', name: 'rasengan', cost: 10, value: 20, type: 'damage', key: '', blocked: false, charId: 'naruto-id' },
	{ id: '2', name: 'chute', cost: 200, value: 20, type: 'damage', key: '', blocked: false, charId: 'naruto-id' },
	{ id: '3', name: 'soco', cost: 10, value: 100, type: 'damage', key: '', blocked: false, charId: 'naruto-id' },
	{ id: '7', name: 'gomu no pistol', cost: 10, value: 20, type: 'damage', key: '', blocked: false, charId: 'luffy-id' },
	{ id: '8', name: 'gomu no stamp', cost: 10, value: 20, type: 'damage', key: '', blocked: false, charId: 'luffy-id' },
];

describe('#Battle Suite', () => {
	let service: Battle;
	
	let naruto: ICharacter;
	let luffy: ICharacter;
	
	let player: IPlayer;
	
	let adversary: IPlayer;
	
	beforeEach(() => {
		naruto = {
			id: 'naruto-id',
			name: 'Naruto',
			attrs: {
				health: 100,
				stamina: 100,
				speed: 10
			},
			skills: skills.filter(s => s.charId === 'naruto-id')
		};
		
		luffy = {
			id: 'luffy-id',
			name: 'luffy',
			attrs: {
				health: 100,
				stamina: 100,
				speed: 2
			},
			skills: skills.filter(s => s.charId === 'luffy-id')
		};

		player = {
			id: 'playerId',
			name: 'Player name',
			team: [] as ICharacter[]
		};
		
		adversary = {
			id: 'adversaryId',
			name: 'Adversary name',
			team: [] as ICharacter[]
		};
		
		player.team.push(naruto);
		adversary.team.push(luffy);

		service = new Battle(player, adversary);
	});

	describe('## Current Char', () => {
		it('should have current char when instancing class', () => {
			const newInstance = new Battle(player, adversary);
			const state = newInstance.getState();
			expect(state.currentChar).toStrictEqual(naruto);
		});
	});

	describe('## Skill and Target invalid', () => {
		it('should to recharge stamina if skill not exist', async () => {
			const currentChar = service.getCurrentCharacter();
			service.execute('', luffy.id);
			expect(currentChar.attrs.stamina).toBe(100);
		});
  
		it('should to recharge stamina if target not exist', async () => {
			const currentChar = service.getCurrentCharacter();
			service.execute(naruto.skills[0].id, '');
			expect(currentChar.attrs.stamina).toBe(100);
		});

		it('should to next turn if skill not exist', async () => {
			service.execute(naruto.skills[0].id, '');
			const state = service.getState();
			expect(state.currentCharIndex).toBe(1);
		});
  
		it('should to next turn if target not exist', async () => {
			service.execute('', luffy.id);
			const state = service.getState();
			expect(state.currentCharIndex).toBe(1);
		});
	});

	describe('## Skills Availables', () => {
		it('should to recharge stamina if skill unavailable', async () => {
			const currentChar = service.getCurrentCharacter();
			service.execute(naruto.skills[1].id, luffy.id);

			const state = service.getState();
			
			expect(state.skillsBlocked).length(1);
			expect(state.skillsBlocked).toContainEqual(naruto.skills[1]);
			expect(currentChar.skills[1].blocked).toBe(true);
		});
	});

	describe('## Execute Skill', () => {
		it('should be able to execute skill type damage', () => {
			const currentChar = service.getCurrentCharacter();
			
			const amountHealth  = luffy.attrs.health - naruto.skills[0].value;
			const amountStamina = currentChar.attrs.stamina - naruto.skills[0].cost;
			
			service.execute(naruto.skills[0].id, luffy.id);
			
			const state = service.getState();

			expect(luffy.attrs.health).toBe(amountHealth);
			expect(currentChar.attrs.stamina).toBe(amountStamina);
			expect(state.currentCharIndex).toBe(1);
			expect(state.currentChar.id).toStrictEqual(luffy.id);
		});

		it('should remove the target from array allChars if health to equal zero', () => {
			service.execute(naruto.skills[2].id, luffy.id);
			const state = service.getState();

			const expected = [
				{...naruto}
			];

			expect(luffy.attrs.health).toBe(0);
			expect(state.allChars.length).toBe(1);
			expect(state.allChars).toStrictEqual(expected);
		});
	});

	describe('## Next turn', () => {
		it.todo('should set currentCharIndex to zero if currentCharIndex is greater than allChars');
		it.todo('should increment round');
	});
});