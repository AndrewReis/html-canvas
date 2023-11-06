import { Router } from 'express';

export const routes = Router();

routes.get('/characters', async (req, res) => {
	const characters = [
		{
			id: 1,
			name: 'test'
		}
	];

	return res.json(characters);
});

routes.get('/characters/:charId', async (req, res) => {
	const character = {
		id: '1',
		name: 'captain',
		skills: [
			{ blocked: false, cost: 5, id: '2', key: 'cap', name: 'atq 1', type: 'damage', value: 50 }
		],
		anims: [
			{
				repeat: true,
				frameRate: 8,
				prefix: 'idle',
				suffix: '.png',
				end: 8,
				zeroPad: 1,
				key: 'idle'
			},
			{
				repeat: false,
				frameRate: 8,
				prefix: 'action1_',
				suffix: '.png',
				end: 8,
				zeroPad: 1,
				key: 'action1'
			}
		],
		playerId: '5522feee-f727-4c2d-a3a7-6cebd41a3367',
		attrs: {
			health: 100,
			speed: 5,
			stamina: 50,
		}
	};

	return res.json(character);
});