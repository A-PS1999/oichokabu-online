export const PHASES = {
    PICK_DEALER: 'pickDealer',
    DEALER_REVEAL: 'dealerReveal',
    BETTING: 'bettingPhase',
    DECIDE_THIRD_CARD: 'decideThirdCardPhase',
    DEALER_CARDS: 'dealerCardsPhase',
    SCORING: 'scoringPhase',
    ROUND_RESULTS: 'roundResults',
    END_GAME: 'endGame',
} as const;

export type Phase = (typeof PHASES)[keyof typeof PHASES];

export const PHASE_DURATIONS_MS: Partial<Record<Phase, number>> = {
    [PHASES.DEALER_REVEAL]: 4000,
    [PHASES.ROUND_RESULTS]: 6000,
};

export const TRANSITIONS: Record<Phase, readonly Phase[]> = {
    [PHASES.PICK_DEALER]: [PHASES.DEALER_REVEAL, PHASES.END_GAME],
    [PHASES.DEALER_REVEAL]: [PHASES.BETTING, PHASES.END_GAME],
    [PHASES.BETTING]: [PHASES.DECIDE_THIRD_CARD, PHASES.END_GAME],
    [PHASES.DECIDE_THIRD_CARD]: [PHASES.DEALER_CARDS, PHASES.END_GAME],
    [PHASES.DEALER_CARDS]: [PHASES.SCORING, PHASES.END_GAME],
    [PHASES.SCORING]: [PHASES.ROUND_RESULTS, PHASES.END_GAME],
    [PHASES.ROUND_RESULTS]: [PHASES.BETTING, PHASES.END_GAME],
    [PHASES.END_GAME]: [],
};

export const canTransition = (from: Phase, to: Phase): boolean =>
    TRANSITIONS[from]?.includes(to) ?? false;

export const isTimed = (phase: Phase): boolean =>
    Object.prototype.hasOwnProperty.call(PHASE_DURATIONS_MS, phase);