export type Phase =
    | 'pickDealer'
    | 'dealerReveal'
    | 'bettingPhase'
    | 'decideThirdCardPhase'
    | 'dealerCardsPhase'
    | 'scoringPhase'
    | 'roundResults'
    | 'endGame';

export type Card = {
    id: number;
    value: number;
    src: string;
};

export type CardBet = {
    userId: number;
    cardId: number;
    ownerColumn: number;
    betAmount: number;
    value: number;
};

export type NewCardBet = Omit<CardBet, 'value'>;

export type PickDealerCardBet = {
    userId: number;
    cardId: number;
    cardVal: number;
};

export type PickDealerCardBetInput = Omit<PickDealerCardBet, 'cardVal'>;

export type PickDealerReveal = PickDealerCardBet;

export type YakuResult = 'arashi' | 'arashi kabu' | boolean;

export type Player = {
    id: number;
    username: string;
    chips: number;
    cardBet: Array<CardBet | Card>;
    isDealer: boolean | null;
    thirdCardChosen: boolean | null;
    seat: number;
};

export type CardColumn = {
    columnId: number;
    cards: Card[];
};

export type BustInfo = {
    userId: number;
    username: string;
    chips: number;
};

export type RoundResultEntry = {
    userId: number;
    username: string;
    betAmount: number;
    handValue: number;
    yaku: YakuResult;
    delta: number;
};

export type RoundResult = {
    turn: number;
    dealerId: number;
    dealerUsername: string;
    dealerHandValue: number;
    dealerYaku: YakuResult;
    busted: BustInfo[];
    results: ReadonlyArray<RoundResultEntry>;
};

export type PlayerDataView = {
    id: number;
    username: string;
    chips: number;
    isDealer: boolean | null;
    thirdCardChosen: boolean | null;
    cardBet?: Array<CardBet | Card>;
};

export type PickDealerCardView = {
    id: number;
    src: string;
};

export type CardBetView =
    | CardBet
    | PickDealerCardBet
    | { userId: number; cardId: number };

export type GeneralDataView = {
    currentTurn: number;
    currentOverallBet: number;
    currentPhase: Phase;
    turnMax: number;
    betMax: number;
    currentPlayer: Player;
    isPickDealer: boolean;
    pickDealerCardsArray?: ReadonlyArray<PickDealerCardView>;
    pickDealerReveals?: readonly PickDealerReveal[];
    cardBets: ReadonlyArray<CardBetView>;
    cardsOnBoard: readonly CardColumn[];
    phaseEnteredAt: number;
    phaseDurationMs: number | null;
    currentDealer?: Player;
    lastRoundResult?: RoundResult;
};

export type GameDataView = {
    general_data: GeneralDataView;
    players_data: PlayerDataView[];
};
