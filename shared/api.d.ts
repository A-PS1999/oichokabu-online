export type GameStatus = 'open' | 'started' | 'running' | 'ended';

export type AuthUser = {
    id: number;
    username: string;
    email: string;
    user_chips: number;
};

export type UserIdResponse = {
    id: number;
};

export type PlayerGameStatus = {
    ready: boolean;
    host: boolean;
};

export type LobbyRoom = {
    game_id: number;
    room_name: string;
    status: GameStatus;
    player_cap: number;
    turn_max: number;
    bet_max: number;
    Players: PlayerGameStatus[];
};

export type PlayerStatus = {
    id: number;
    username: string;
    user_chips: number;
    Players: PlayerGameStatus[];
};

export type PlayerInfo = {
    game_id: number;
    room_name: string;
    status: GameStatus;
    player_cap: number;
    turn_max: number;
    bet_max: number;
    Players?: PlayerGameStatus[];
};

export type PlayerAuth = {
    id: number;
    host: {
        host: boolean;
        ready: boolean;
    };
};

