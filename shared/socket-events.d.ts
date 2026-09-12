import type { GameDataView } from './game';

export type GameId = number;
export type UserId = number;

export type LobbyCreateGamePayload = {
    gameId: GameId;
    userId: UserId;
    username: string;
    roomName: string;
    playerCap: number;
    turnMax: number;
    betMax: number;
};

export type LobbyMembershipPayload = {
    gameId: GameId;
    userId: UserId;
    username: string;
};

export type PregameEnterGamePayload = GameId;

export type PregameLeaveGamePayload = {
    gameId: GameId;
    userId: UserId;
    username: string;
    hostStatus: boolean;
};

export type PregamePlayerPayload = {
    gameId: GameId;
    userId: UserId;
    username: string;
};

export type GameUpdatePayload = GameDataView;

export type PickDealerCardSelectedPayload = {
    userId: UserId;
    cardId: number;
    cardVal: number;
};

export type CardBetMadePayload = {
    userId: UserId;
    cardId: number;
};

export type PlayerBustedPayload = {
    userId: UserId;
    username: string;
    chips: number;
};

export type SocketAckResponse = {
    ok: boolean;
    reason?: string;
};

export type JoinGameAck = SocketAckResponse;

export type SocketEventPayloads = {
    'lobby:create-game': LobbyCreateGamePayload;
    'lobby:join-game': LobbyMembershipPayload;
    'lobby:leave-game': LobbyMembershipPayload;
    'lobby:start-game': LobbyMembershipPayload;
    'lobby:end-game': LobbyMembershipPayload;
    'game:update-game': GameUpdatePayload;
    'game:pickdealer-card-selected': PickDealerCardSelectedPayload;
    'game:card-bet-made': CardBetMadePayload;
    'game:player-busted': PlayerBustedPayload;
    'game:end-game': void;
};
