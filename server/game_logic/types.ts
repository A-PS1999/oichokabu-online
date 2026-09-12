import type { Phase } from './phases';
import type {
    BustInfo,
    Card,
    CardBet,
    CardColumn,
    GameDataView,
    GeneralDataView,
    NewCardBet,
    PickDealerCardBet,
    PickDealerCardBetInput,
    PickDealerReveal,
    Player,
    PlayerDataView,
    RoundResult,
    YakuResult,
} from '@shared/game';

export type {
    BustInfo,
    Card,
    CardBet,
    CardColumn,
    GameDataView,
    GeneralDataView,
    NewCardBet,
    PickDealerCardBet,
    PickDealerCardBetInput,
    PickDealerReveal,
    Player,
    PlayerDataView,
    RoundResult,
    YakuResult,
};

export type GameState = {
    deck: Card[];
    players: Player[];
    currentPlayer: Player;
    currentDealer: Player | null;
    currentTurn: number;
    currentOverallBet: number;
    cardBets: Array<CardBet | PickDealerCardBet>;
    pickDealerCardsArray: Card[];
    pickDealerReveals: PickDealerReveal[];
    lastRoundResult: RoundResult | null;
    cardsOnBoard: CardColumn[];
    isPickDealer: boolean;
    currentPhase: Phase;
    phaseEnteredAt: number;
    phaseDurationMs: number | null;
    turnMax: number;
    betMax: number;
    pendingBusts?: BustInfo[];
    shuffle: <T>(cardsDeck: T[]) => T[];
};

export type OkUser = {
    id: number;
    username: string;
    user_chips: number;
};

export type GameConstants = {
    turn_max: number;
    bet_max: number;
};
