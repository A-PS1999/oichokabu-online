import API from './api';

export const UserAPI = {
	getUserId: () => API.get('/get-user-id', {})
}

export const LobbyAPI = {
	getGames: () => API.get('/lobby/lobbies', {}),
	postNewGame: (roomName, playerCap, turnMax, betMax) => API.post('/lobby/create-game', { roomName, playerCap, turnMax, betMax }),
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

export const GameAPI = {
	getPlayerAuth: gameId => API.get(`/game/${gameId}/authenticate-player`, {}),
	postJoinGame: gameId => API.post(`/game/${gameId}/join`, {}),
	postStartGame: gameId => API.post(`/game/${gameId}/start`, {}),
	postLoadGame: gameId => API.post(`/game/${gameId}/load`, {}),
	postUpdateGame: gameId => API.post(`/game/${gameId}/update`, {}),
	postDealerCardSelected: (gameId, cardId, cardVal) => API.post(`/game/${gameId}/pickdealer-card-selected`, { cardId, cardVal }),
	postCardBet: (gameId, betAmount) => API.post(`/game/${gameId}/card-bet`, { betAmount }),
	postUpdateChips: newChips => API.post('/game/update-player-chips', { newChips }),
}