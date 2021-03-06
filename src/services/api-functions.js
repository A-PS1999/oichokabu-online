import API from './api';

export const UserAPI = {
	getUserId: () => API.get('/get-user-id', {})
}

export const LobbyAPI = {
	getGames: () => API.get('/lobby/lobbies', {}),
	postNewGame: (roomName, playerCap, turnMax, betMax) => API.post('/lobby/create-game', { roomName, playerCap, turnMax, betMax }),
	getUserChips: () => API.get('/lobby/user-chips', {}),
	resetUserChips: (chips) => API.post('/lobby/reset-chips', { chips }),
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
	postUpdateGame: gameId => API.post(`/game/${gameId}/update`, {}),
	postReloadGame: gameId => API.post(`/game/${gameId}/reload`, {}),
	postDealerCardSelected: (gameId, cardId, cardVal) => API.post(`/game/${gameId}/pickdealer-card-selected`, { cardId, cardVal }),
	postCardBet: (gameId, betAmount) => API.post(`/game/${gameId}/card-bet`, { betAmount }),
	postThirdCardChoice: (gameId, choiceMade, isDealer) => API.post(`/game/${gameId}/decide-third-card`, { choiceMade, isDealer }),
	postUpdateChips: newChips => API.post('/game/update-player-chips', { newChips }),
	postRemovePlayer: gameId => API.post(`/game/${gameId}/remove-player`, {}),
}