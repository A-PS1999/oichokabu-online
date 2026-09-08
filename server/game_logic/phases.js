const PHASES = {
    PICK_DEALER: 'pickDealer',
    DEALER_REVEAL: 'dealerReveal',
    BETTING: 'bettingPhase',
    DECIDE_THIRD_CARD: 'decideThirdCardPhase',
    DEALER_CARDS: 'dealerCardsPhase',
    SCORING: 'scoringPhase',
    ROUND_RESULTS: 'roundResults',
    END_GAME: 'endGame',
    // TODO: remove these
    CHECK_FOR_BUST_PLAYERS: 'checkForBustPlayers',
    PREPARE_NEXT_ROUND: 'prepareNextRound',
};

const PHASE_DURATIONS_MS = {
    [PHASES.DEALER_REVEAL]: 4000,
    [PHASES.ROUND_RESULTS]: 6000,
    // TODO: remove this
    [PHASES.PREPARE_NEXT_ROUND]: 1000,
};

// TODO: Refactor this to remove redundant phases
const TRANSITIONS = {
    [PHASES.PICK_DEALER]: [PHASES.DEALER_REVEAL, PHASES.BETTING, PHASES.END_GAME],
    [PHASES.DEALER_REVEAL]: [PHASES.BETTING, PHASES.END_GAME],
    [PHASES.BETTING]: [PHASES.DECIDE_THIRD_CARD, PHASES.END_GAME],
    [PHASES.DECIDE_THIRD_CARD]: [PHASES.DEALER_CARDS, PHASES.END_GAME],
    [PHASES.DEALER_CARDS]: [PHASES.SCORING, PHASES.END_GAME],
    [PHASES.SCORING]: [PHASES.ROUND_RESULTS, PHASES.CHECK_FOR_BUST_PLAYERS, PHASES.END_GAME],
    [PHASES.CHECK_FOR_BUST_PLAYERS]: [PHASES.PREPARE_NEXT_ROUND, PHASES.END_GAME],
    [PHASES.PREPARE_NEXT_ROUND]: [PHASES.BETTING, PHASES.END_GAME],
    [PHASES.ROUND_RESULTS]: [PHASES.BETTING, PHASES.END_GAME],
    [PHASES.END_GAME]: [],
};

const canTransition = (from, to) => TRANSITIONS[from]?.includes(to) ?? false;

const isTimed = phase => Object.prototype.hasOwnProperty.call(PHASE_DURATIONS_MS, phase);

module.exports = { PHASES, PHASE_DURATIONS_MS, TRANSITIONS, canTransition, isTimed };