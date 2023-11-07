// dependencies
import express 					from 'express';
import cors 						from 'cors';
import { createServer } from 'node:http';
import { Server } 			from 'socket.io';

import { adversary, player} from './database';
import { socketEvents }     from './socket-events';
import { routes } 			    from './routes';

import { Battle } from './models/Battle';

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(routes);

const server = createServer(app);
const io 		 = new Server(server);

io.on('connection', async (socket) => {
	const battle = new Battle(player, adversary);

	battle.init();

	socket.emit(socketEvents.initState, battle.getState());

	socket.on('EXECUTE_ACTION', ({ skillId, targetId }) => {
		battle.execute(skillId, targetId);
		socket.emit('NEXT_TURN', battle.getState());

		const iaCommands = battle.checkIATurn();

		if (iaCommands) {
			socket.emit('IA_COMMANDS', iaCommands);
		}
	});

	socket.on('RECHARGE_STAMINA', () => {
		battle.rechargeStamina();
		socket.emit('NEXT_TURN', battle.getState());

		const iaCommands = battle.checkIATurn();

		if (iaCommands) {
			socket.emit('IA_COMMANDS', iaCommands);
		}
	});
});

server.listen(3000, () => {
	console.log('server running at http://localhost:3000');
});