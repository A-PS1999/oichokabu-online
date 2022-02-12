import API from './api';

export const UserAPI = {
	getUserId: () => API.get('/get-user-id', {})
}

export const LobbyAPI = {
	getGames: () => API.get('/lobby/lobbies', {}),
	postNewGame: (roomName, playerCap, turnMax) => API.post('/lobby/create-game', { roomName, playerCap, turnMax }),
}

export const PregameAPI = {
	getPlayerInfo: gameId => API.get(`/pregame-lobby/${gameId}/player-info`, {}),
	getPlayerStatuses: gameId => API.get(`/pregame-lobby/${gameId}/player-status`, {}),
	postEnterLobby: gameId => API.post(`/pregame-lobby/${gameId}/join-lobby`, {}),
	postJoinGame: gameId => API.post(`/pregame-lobby/${gameId}/join-game`, {}),
	postLeaveGame: gameId => API.post(`/pregame-lobby/${gameId}/leave-game`, {}),
	postGameStart: gameId => API.post(`/pregame-lobby/${gameId}/start-game`, {}),
	postReadyStatus: gameId => API.post(`/pregame-lobby/${gameId}/toggle-ready`),
}