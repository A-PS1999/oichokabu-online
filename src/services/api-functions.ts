import API from './api';
import type {
	AuthUser,
	LobbyRoom,
	PlayerAuth,
	PlayerInfo,
	PlayerStatus,
	UserIdResponse,
} from '@shared/api';
import type { GameDataView } from '@shared/game';

export type GameId = string | number;

export type RegisterResponse = {
	auth: AuthUser;
};

export type LoginResponse = {
	auth: AuthUser;
};

export type NewGamePayload = {
	roomName: string;
	playerCap: number;
	turnMax: number;
	betMax: number;
};

export type CardBetRequestBody = {
	currentCard: { id: number; ownerColumn: number } | null;
	betAmount: number;
};

export const UserAPI = {
	getUserId: (): Promise<UserIdResponse> => API.get<UserIdResponse>('/get-user-id', {}),
};

export const LobbyAPI = {
	getGames: (): Promise<LobbyRoom[]> => API.get<LobbyRoom[]>('/lobby/lobbies', {}),
	postNewGame: (roomName: string, playerCap: number, turnMax: number, betMax: number): Promise<LobbyRoom> =>
		API.post<LobbyRoom>('/lobby/create-game', { roomName, playerCap, turnMax, betMax }),
	getUserChips: (): Promise<number> => API.get<number>('/lobby/user-chips', {}),
	resetUserChips: (chips: number): Promise<void> => API.post<void>('/lobby/reset-chips', { chips }),
};

export const PregameAPI = {
	getPlayerInfo: (gameId: GameId): Promise<PlayerInfo> =>
		API.get<PlayerInfo>(`/pregame-lobby/${gameId}/player-info`, {}),
	getPlayerStatuses: (gameId: GameId): Promise<PlayerStatus[]> =>
		API.get<PlayerStatus[]>(`/pregame-lobby/${gameId}/player-status`, {}),
	postJoinGame: (gameId: GameId): Promise<unknown> =>
		API.post<unknown>(`/pregame-lobby/${gameId}/join-game`, {}),
	postLeaveGame: (gameId: GameId): Promise<unknown> =>
		API.post<unknown>(`/pregame-lobby/${gameId}/leave-game`, {}),
	postGameStart: (gameId: GameId): Promise<unknown> =>
		API.post<unknown>(`/pregame-lobby/${gameId}/start-game`, {}),
	postReadyStatus: (gameId: GameId): Promise<unknown> =>
		API.post<unknown>(`/pregame-lobby/${gameId}/toggle-ready`),
};

export const GameAPI = {
	getPlayerAuth: (gameId: GameId): Promise<PlayerAuth> =>
		API.get<PlayerAuth>(`/game/${gameId}/authenticate-player`, {}),
	postStartGame: (gameId: GameId): Promise<void> => API.post<void>(`/game/${gameId}/start`, {}),
	postUpdateGame: (gameId: GameId): Promise<void> => API.post<void>(`/game/${gameId}/update`, {}),
	postDealerCardSelected: (gameId: GameId, cardId: number): Promise<void> =>
		API.post<void>(`/game/${gameId}/pickdealer-card-selected`, { cardId }),
	postCardBet: (gameId: GameId, betData: CardBetRequestBody): Promise<void> =>
		API.post<void>(`/game/${gameId}/card-bet`, { betData }),
	postThirdCardChoice: (gameId: GameId, choiceMade: string, isDealer: boolean): Promise<void> =>
		API.post<void>(`/game/${gameId}/decide-third-card`, { choiceMade, isDealer }),
};

export type { GameDataView };
