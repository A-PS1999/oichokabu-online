import type { Model } from 'sequelize';
import type { GameConstants, OkUser } from '../game_logic/types';

export type UserAttributes = {
    id: number;
    username: string;
    email: string;
    password: string;
    user_chips: number;
};

export type PlayerAttributes = {
    player_id: number;
    player_userid: number;
    player_gameid: number;
    ready: boolean;
    host: boolean;
};

export type GameAttributes = {
    game_id: number;
    status: 'open' | 'started' | 'running' | 'ended';
    room_name: string;
    player_cap: number;
    turn_max: number;
    bet_max: number;
};

export type SessionAttributes = {
    sid: string;
    sess: Record<string, unknown>;
    expire: Date;
};

export type UserInstance = Model<UserAttributes> & UserAttributes;

export type PlayerInstance = Model<PlayerAttributes> & PlayerAttributes & {
    getGame: () => Promise<GameInstance>;
};

export type GameInstance = Model<GameAttributes> & GameAttributes & {
    getUsers: (options?: { attributes?: string[] }) => Promise<UserInstance[]>;
    getPlayers: () => Promise<PlayerInstance[]>;
};

export type SessionInstance = Model<SessionAttributes> & SessionAttributes;

export type AuthAPI = {
    addUser: (username: string, email: string, password: string) => Promise<UserInstance>;
    findByUsername: (username: string) => Promise<UserInstance | null>;
    findByEmail: (email: string) => Promise<UserInstance | null>;
    findById: (id: number) => Promise<UserInstance | null>;
    updatePassword: (email: string, new_password: string) => Promise<unknown>;
    findPlayer: (player_gameid: number, player_userid: number) => Promise<PlayerInstance | null>;
    addSession: (sid: string, sess: Record<string, unknown>, expire: Date) => Promise<SessionInstance>;
    removeSession: (sid: string) => Promise<number>;
    findSessionById: (sid: string) => Promise<SessionInstance | null>;
};

export type GameAPI = {
    getUserIdsAndUsernames: (game_id: number) => Promise<OkUser[]>;
    getGameConstants: (game_id: number) => Promise<GameConstants>;
    removePlayer: (player_gameid: number, player_userid: number) => Promise<unknown>;
    runGame: (game_id: number) => Promise<unknown>;
    endGame: (game_id: number) => Promise<unknown>;
    getStatus: (game_id: number) => Promise<GameAttributes['status']>;
    updateChipsBulk: (entries: ReadonlyArray<{ player_userid: number; new_chips: number }>) => Promise<unknown>;
};

export type LobbyAPI = {
    findOngoingGames: () => Promise<GameAttributes[]>;
    addGame: (
        player_userid: number,
        room_name: string,
        player_cap: number,
        turn_max: number,
        bet_max: number,
    ) => Promise<GameInstance>;
    getUserChips: (userId: number) => Promise<number>;
    resetChips: (userId: number) => Promise<unknown>;
};

export type PreGameAPI = {
    getPlayers: (game_id: number) => Promise<GameInstance>;
    getPlayerStatuses: (player_gameid: number) => Promise<UserAttributes[]>;
    joinGame: (player_gameid: number, player_userid: number) => Promise<unknown>;
    exitGame: (player_gameid: number, player_userid: number) => Promise<unknown>;
    setGameStarted: (game_id: number) => Promise<unknown>;
    setGameReady: (game_id: number) => Promise<{ ready: boolean; status: string }>;
    accessPlayerReady: (player_gameid: number, player_userid: number) => Promise<{ ready: boolean } | null>;
    togglePlayerReady: (player_gameid: number, player_userid: number) => Promise<[number, PlayerInstance[]]>;
};