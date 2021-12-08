import API from './api';

export const LobbyAPI = {
	getGames: () => API.get('/lobby/lobbies', {}),
	postNewGame: (roomName, playerCap, turnMax) => API.post('/lobby/create-game', { roomName, playerCap, turnMax }),
}