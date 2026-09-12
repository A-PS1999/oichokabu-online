import * as game_controls from './game_controls';
import * as phases from './phases';
import type { Phase } from './phases';
import type {
    GameConstants,
    GameDataView,
    GameState,
    GeneralDataView,
    NewCardBet,
    OkUser,
    PickDealerCardBet,
    PickDealerCardBetInput,
    PlayerDataView,
} from './types';

// A player busts when their chips drop below the minimum bet.
const BUST_CHIPS_THRESHOLD = 100;

const setPhase = (Game: GameState, phase: Phase): void => {
    if (!phases.canTransition(Game.currentPhase, phase)) {
        throw new Error(`Invalid transition ${Game.currentPhase} -> ${phase}`);
    }
    Game.currentPhase = phase;
    Game.phaseEnteredAt = Date.now();
    Game.phaseDurationMs = phases.isTimed(phase) ? (phases.PHASE_DURATIONS_MS[phase] ?? null) : null;
};

const game_engine = {
    handleStartTurn: (Game: GameState): void => {
        const player = Game.currentPlayer;
        game_controls.startTurn({ Game, player });
    },
    start: (ok_users: OkUser[], constants: GameConstants): GameState => {
        const Game = game_controls.startGame({ ok_users }, constants);
        game_engine.handleStartTurn(Game);
        return Game;
    },
    getGameData: (Game: GameState, playerId: number): GameDataView => {
        const isRevealView = Game.isPickDealer || Game.currentPhase === phases.PHASES.DEALER_REVEAL;

        const general_data: GeneralDataView = {
            currentTurn: Game.currentTurn,
            currentOverallBet: Game.currentOverallBet,
            currentPhase: Game.currentPhase,
            turnMax: Game.turnMax,
            betMax: Game.betMax,
            currentPlayer: Game.currentPlayer,
            isPickDealer: Game.isPickDealer,
            cardBets: isRevealView
                ? Game.cardBets.map(({ userId, cardId }) => ({ userId, cardId }))
                : Game.cardBets,
            cardsOnBoard: Game.cardsOnBoard,
            phaseEnteredAt: Game.phaseEnteredAt,
            phaseDurationMs: Game.phaseDurationMs,
        };

        if (isRevealView) {
            general_data.pickDealerCardsArray = Game.pickDealerCardsArray.map(({ id, src }) => ({ id, src }));
            general_data.pickDealerReveals = Game.pickDealerReveals;
        }
        if (Game.currentDealer) {
            general_data.currentDealer = Game.currentDealer;
        }
        if (Game.lastRoundResult) {
            general_data.lastRoundResult = Game.lastRoundResult;
        }

        const players_data: PlayerDataView[] = [];
        for (const player of Game.players) {
            const tempPlayer: PlayerDataView = {
                id: player.id,
                username: player.username,
                chips: player.chips,
                isDealer: player.isDealer,
                thirdCardChosen: player.thirdCardChosen,
            };
            if (player.id === playerId) {
                tempPlayer.cardBet = player.cardBet;
            }
            players_data.push(tempPlayer);
        }

        return { general_data, players_data };
    },
    handleRemovePlayer: (Game: GameState, playerId: number): void => {
        game_controls.removePlayer(Game, playerId);
        if (Game.players.length < 2) {
            setPhase(Game, phases.PHASES.END_GAME);
        }
    },
    onEndTurn: (Game: GameState, playerId: number): void => {
        const player = Game.currentPlayer;
        if (player.id === playerId) {
            game_engine.handleEndTurn(Game);
            console.log('Ending turn');
        } else {
            console.log('End turn not possible');
        }
    },
    handleEndTurn: (Game: GameState): void => {
        Game.currentPlayer = game_controls.nextPlayerBySeat(Game, Game.currentPlayer.seat);
        if (Game.currentOverallBet !== Game.betMax) {
            game_engine.handleStartTurn(Game);
        } else {
            game_controls.setThirdCardBool(Game);
            game_engine.handlePlayerSecondCard(Game);
        }
    },
    pushPickDealerCardSelection: (Game: GameState, choiceInfo: PickDealerCardBetInput): PickDealerCardBet | null => {
        if (Game.currentPhase !== phases.PHASES.PICK_DEALER) return null;
        if (Game.cardBets.some(bet => bet.userId === choiceInfo.userId)) return null;

        const card = Game.pickDealerCardsArray.find(card => card.id === choiceInfo.cardId);
        if (!card) return null;

        const bet: PickDealerCardBet = { ...choiceInfo, cardVal: card.value };
        Game.cardBets.push(bet);

        if (Game.cardBets.length === Game.players.length) {
            const pickDealerBets = Game.cardBets as PickDealerCardBet[];
            Game.pickDealerReveals = pickDealerBets.map(bet => ({
                userId: bet.userId,
                cardId: bet.cardId,
                cardVal: bet.cardVal,
            }));
            game_controls.determineFirstDealer(Game);
            setPhase(Game, phases.PHASES.DEALER_REVEAL);
        }
        return bet;
    },
    pushCardBet: (Game: GameState, betInfo: NewCardBet): void => {
        if (Game.currentPhase !== phases.PHASES.BETTING) return;
        if (betInfo.userId !== Game.currentPlayer.id) return;

        const player = Game.currentPlayer;
        game_controls.handleCardBet(Game, player, betInfo);
        game_engine.handleEndTurn(Game);

        if (Game.cardBets.length === Game.players.length - 1 && Game.currentOverallBet !== Game.betMax) {
            game_engine.handlePlayerSecondCard(Game);
        }
    },
    handlePlayerSecondCard: (Game: GameState): void => {
        game_controls.pushPlayerSecondCard({ Game });
        setPhase(Game, phases.PHASES.DECIDE_THIRD_CARD);
        if (game_controls.checkPlayersThirdCardsStatus({ Game })) {
            game_engine.handleDealerSecondCard(Game);
        }
    },
    handleOptionalThirdPlayerCard: (Game: GameState, userId: number, choiceMade: 'yes' | 'no'): void => {
        if (Game.currentPhase !== phases.PHASES.DECIDE_THIRD_CARD) return;

        const playerIndex = Game.players.findIndex(player => player.id === userId);
        if (choiceMade === 'no') {
            const player = Game.players[playerIndex];
            if (player) {
                player.thirdCardChosen = false;
            }
        }
        if (choiceMade === 'yes') {
            game_controls.pushPlayerThirdCard({ Game, playerIndex });
        }
        if (game_controls.checkPlayersThirdCardsStatus({ Game })) {
            game_engine.handleDealerSecondCard(Game);
        }
    },
    handleDealerSecondCard: (Game: GameState): void => {
        const dealer = Game.currentDealer;
        if (!dealer) throw new Error('Cannot deal the dealer second card without a dealer');
        setPhase(Game, phases.PHASES.DEALER_CARDS);
        game_controls.pushDealerSecondCard({ Game, dealer });
        if (game_controls.checkAllThirdCardsStatus({ Game })) {
            game_engine.resolveRound(Game);
        }
    },
    handleOptionalThirdDealerCard: (Game: GameState, choiceMade: 'yes' | 'no'): void => {
        if (Game.currentPhase !== phases.PHASES.DEALER_CARDS) return;

        const dealer = Game.currentDealer;
        if (!dealer) throw new Error('Cannot handle the dealer third card without a dealer');

        if (choiceMade === 'no') {
            dealer.thirdCardChosen = false;
        }
        if (choiceMade === 'yes') {
            game_controls.pushDealerThirdCard({ Game, dealer });
        }
        if (game_controls.checkAllThirdCardsStatus({ Game })) {
            game_engine.resolveRound(Game);
        }
    },
    resolveRound: (Game: GameState): void => {
        setPhase(Game, phases.PHASES.SCORING);
        game_controls.resolveBets({ Game });

        const lastRoundResult = Game.lastRoundResult;
        if (!lastRoundResult) throw new Error('Cannot resolve the round without a result');
        lastRoundResult.busted = Game.players
            .filter(player => player.chips < BUST_CHIPS_THRESHOLD)
            .map(({ id, username, chips }) => ({ userId: id, username, chips }));

        setPhase(Game, phases.PHASES.ROUND_RESULTS);
    },
    advance: (Game: GameState): void => {
        if (Game.currentPhase === phases.PHASES.DEALER_REVEAL) {
            game_controls.prepMainGameInitialState(Game);
            game_engine.handleStartTurn(Game);
            setPhase(Game, phases.PHASES.BETTING);
            Game.pickDealerReveals = [];
        } else if (Game.currentPhase === phases.PHASES.ROUND_RESULTS) {
            if (Game.currentTurn >= Game.turnMax || Game.players.length < 2) {
                setPhase(Game, phases.PHASES.END_GAME);
            } else {
                const bustedPlayers = Game.players.filter(player => player.chips < BUST_CHIPS_THRESHOLD);
                Game.pendingBusts = bustedPlayers.map(({ id, username, chips }) => ({ userId: id, username, chips }));

                for (const player of bustedPlayers) {
                    game_engine.handleRemovePlayer(Game, player.id);
                    if (Game.players.length < 2) break;
                }
                if (Game.players.length < 2) {
                    return;
                }

                game_controls.prepNextRound({ Game });
                game_engine.handleStartTurn(Game);
                setPhase(Game, phases.PHASES.BETTING);
            }
        } else {
            console.log(`advance: no-op, ${Game.currentPhase} is not a timed phase`);
        }
    },
};

export { game_engine };