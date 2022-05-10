const game_controls = require('./game_controls');

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
        data.general_data.cardBets = Game.cardBets;
        if (Game.isPickDealer) {
            data.general_data.pickDealerCardsArray = Game.pickDealerCardsArray;
        }
        data.general_data.cardsOnBoard = Game.cardsOnBoard;
        if (Game.currentDealer) {
            data.general_data.currentDealer = Game.currentDealer;
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
            Game.currentPhase = "endGame";
            Game.currentTurn = (Game.turnMax + 1);
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
        Game.currentPlayerIndex = (Game.currentPlayerIndex + 1) % Game.playerCount;
        Game.currentPlayer = Game.players[Game.currentPlayerIndex];
        if (Game.currentOverallBet !== Game.betMax) {
            game_engine.handleStartTurn(Game);
        } else {
            game_controls.setThirdCardBool(Game);
            game_engine.handlePlayerSecondCard(Game);
        }
    },
    pushPickDealerCardSelection: (Game, choiceInfo) => {
        Game.cardBets.push(choiceInfo);
        if (Game.cardBets.length === Game.players.length) {
            game_controls.determineFirstDealer(Game);
            game_controls.prepMainGameInitialState(Game);
        }
    },
    pushCardBet: (Game, betInfo) => {
        let player = Game.currentPlayer;
        game_controls.handleCardBet(Game, player, betInfo);
        game_engine.handleEndTurn(Game);

        if (Game.cardBets.length === (Game.players.length - 1)) {
            game_engine.handlePlayerSecondCard(Game);
        }
    },
    handlePlayerSecondCard: (Game) => {
        game_controls.pushPlayerSecondCard({ Game });
        if (game_controls.checkPlayersThirdCardsStatus({ Game })) {
            game_engine.handleDealerSecondCard(Game);
        }
    },
    handleOptionalThirdPlayerCard: (Game, userId, choiceMade) => {
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
        Game.currentPhase = 'dealerCardsPhase';
        game_controls.pushDealerSecondCard({ Game, dealer });
        if (game_controls.checkAllThirdCardsStatus({ Game })) {
            game_engine.commenceResolvingBets(Game);
        }
    },
    handleOptionalThirdDealerCard: (Game, choiceMade) => {
        let dealer = Game.currentDealer;
        if (choiceMade === 'no') {
            dealer.thirdCardChosen = false;
        }
        if (choiceMade === 'yes') {
            game_controls.pushDealerThirdCard({ Game, dealer });
        }
        if (game_controls.checkAllThirdCardsStatus({ Game })) {
            game_engine.commenceResolvingBets(Game);
        }
    },
    commenceResolvingBets: (Game) => {
        Game.currentPhase = 'scoringPhase';
        game_controls.resolveBets({ Game });
        Game.currentPhase = 'checkForBustPlayers';
        setTimeout(() => game_engine.prepareNextRound(Game), 1000);
        Game.currentPhase = 'prepareNextRound';
    },
    prepareNextRound: (Game) => {
        game_controls.prepNextRound({ Game });
        Game.currentPhase = 'bettingPhase';
        game_engine.handleStartTurn(Game);
    },
};

module.exports = game_engine;