const game_controls = require('./game_controls');
const phases = require('./phases');

// A player busts when their chips drop below the minimum bet.
const BUST_CHIPS_THRESHOLD = 100;

const setPhase = (Game, phase) => {
    if (!phases.canTransition(Game.currentPhase, phase)) {
        throw new Error(`Invalid transition ${Game.currentPhase} -> ${phase}`);
    }
    Game.currentPhase = phase;
    Game.phaseEnteredAt = Date.now();
    Game.phaseDurationMs = phases.isTimed(phase) ? phases.PHASE_DURATIONS_MS[phase] : null;
};

const game_engine = {
    handleStartTurn: Game => {
        let player = Game.currentPlayer;
        game_controls.startTurn({ Game, player });
    },
    start: (ok_users, constants) => {
        let Game = game_controls.startGame({ ok_users }, constants);
        game_engine.handleStartTurn(Game);
        return Game;
    },
    getGameData: (Game, playerId) => {
        let data = {};
        game_engine.getGeneralData(Game, data);
        game_engine.getPlayersData(Game, playerId, data);
        return data;
    },
    getGeneralData: (Game, data) => {
        data.general_data = {};
        data.general_data.currentTurn = Game.currentTurn;
        data.general_data.currentOverallBet = Game.currentOverallBet;
        data.general_data.currentPhase = Game.currentPhase;
        data.general_data.turnMax = Game.turnMax;
        data.general_data.betMax = Game.betMax;
        data.general_data.currentPlayer = Game.currentPlayer;
        data.general_data.isPickDealer = Game.isPickDealer;
        if (Game.isPickDealer || Game.currentPhase === phases.PHASES.DEALER_REVEAL) {
            data.general_data.pickDealerCardsArray = Game.pickDealerCardsArray.map(({ id, src }) => ({ id, src }));
            data.general_data.pickDealerReveals = Game.pickDealerReveals;
            data.general_data.cardBets = Game.cardBets.map(({ userId, cardId }) => ({ userId, cardId }));
        } else {
            data.general_data.cardBets = Game.cardBets;
        }
        data.general_data.cardsOnBoard = Game.cardsOnBoard;
        data.general_data.phaseEnteredAt = Game.phaseEnteredAt;
        data.general_data.phaseDurationMs = Game.phaseDurationMs;
        if (Game.currentDealer) {
            data.general_data.currentDealer = Game.currentDealer;
        }
        if (Game.lastRoundResult) {
            data.general_data.lastRoundResult = Game.lastRoundResult;
        }
    },
    getPlayersData: (Game, playerId, data) => {
        data.players_data = [];
        return Game.players.map(player => {
            let tempPlayer = {};
            tempPlayer.id = player.id;
            tempPlayer.username = player.username;
            tempPlayer.chips = player.chips;
            tempPlayer.isDealer = player.isDealer;
            tempPlayer.thirdCardChosen = player.thirdCardChosen;
            if (player.id === playerId) {
                tempPlayer.cardBet = player.cardBet;
            }
            data.players_data.push(tempPlayer);
        });
    },
    handleRemovePlayer: (Game, playerId) => {
        game_controls.removePlayer(Game, playerId);
        if (Game.players.length < 2) {
            setPhase(Game, 'endGame');
        }
    },
    onEndTurn: (Game, playerId) => {
        let player = Game.currentPlayer;
        if (player.id === playerId) {
            game_engine.handleEndTurn(Game);
            console.log("Ending turn");
        } else {
            console.log("End turn not possible");
        }
    },
    handleEndTurn: (Game) => {
        Game.currentPlayer = game_controls.nextPlayerBySeat(Game, Game.currentPlayer.seat);
        if (Game.currentOverallBet !== Game.betMax) {
            game_engine.handleStartTurn(Game);
        } else {
            game_controls.setThirdCardBool(Game);
            game_engine.handlePlayerSecondCard(Game);
        }
    },
    pushPickDealerCardSelection: (Game, choiceInfo) => {
        if (Game.currentPhase !== phases.PHASES.PICK_DEALER) return null;
        if (Game.cardBets.some(bet => bet.userId === choiceInfo.userId)) return null;
        const card = Game.pickDealerCardsArray.find(card => card.id === choiceInfo.cardId);
        if (!card) return null;
        choiceInfo.cardVal = card.value;
        Game.cardBets.push(choiceInfo);
        if (Game.cardBets.length === Game.players.length) {
            Game.pickDealerReveals = Game.cardBets.map(bet => ({
                userId: bet.userId,
                cardId: bet.cardId,
                cardVal: bet.cardVal,
            }));
            game_controls.determineFirstDealer(Game);
            setPhase(Game, phases.PHASES.DEALER_REVEAL);
        }
        return choiceInfo;
    },
    pushCardBet: (Game, betInfo) => {
        if (Game.currentPhase !== phases.PHASES.BETTING) return;
        if (betInfo.userId !== Game.currentPlayer.id) return;
        let player = Game.currentPlayer;
        game_controls.handleCardBet(Game, player, betInfo);
        game_engine.handleEndTurn(Game);

        if (Game.cardBets.length === (Game.players.length - 1) && Game.currentOverallBet !== Game.betMax) {
            game_engine.handlePlayerSecondCard(Game);
        }
    },
    handlePlayerSecondCard: (Game) => {
        game_controls.pushPlayerSecondCard({ Game });
        setPhase(Game, phases.PHASES.DECIDE_THIRD_CARD);
        if (game_controls.checkPlayersThirdCardsStatus({ Game })) {
            game_engine.handleDealerSecondCard(Game);
        }
    },
    handleOptionalThirdPlayerCard: (Game, userId, choiceMade) => {
        if (Game.currentPhase !== phases.PHASES.DECIDE_THIRD_CARD) return;
        let playerIndex = Game.players.findIndex(player => player.id === userId);
        if (choiceMade === 'no') {
            Game.players[playerIndex].thirdCardChosen = false;
        }
        if (choiceMade === 'yes') {
            game_controls.pushPlayerThirdCard({ Game, playerIndex });
        }
        if (game_controls.checkPlayersThirdCardsStatus({ Game })) {
            game_engine.handleDealerSecondCard(Game);
        }
    },
    handleDealerSecondCard: (Game) => {
        let dealer = Game.currentDealer;
        setPhase(Game, phases.PHASES.DEALER_CARDS);
        game_controls.pushDealerSecondCard({ Game, dealer });
        if (game_controls.checkAllThirdCardsStatus({ Game })) {
            game_engine.resolveRound(Game);
        }
    },
    handleOptionalThirdDealerCard: (Game, choiceMade) => {
        if (Game.currentPhase !== phases.PHASES.DEALER_CARDS) return;
        let dealer = Game.currentDealer;
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
    resolveRound: (Game) => {
        setPhase(Game, phases.PHASES.SCORING);
        game_controls.resolveBets({ Game });
        Game.lastRoundResult.busted = Game.players
            .filter(player => player.chips < BUST_CHIPS_THRESHOLD)
            .map(({ id, username, chips }) => ({ userId: id, username, chips }));
        setPhase(Game, phases.PHASES.ROUND_RESULTS);
    },
    advance: (Game) => {
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
                    if (Game.currentPhase === phases.PHASES.END_GAME) break;
                }
                if (Game.currentPhase === phases.PHASES.END_GAME) {
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

module.exports = game_engine;