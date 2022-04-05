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
            if (player.id === playerId) {
                tempPlayer.cardBet = player.cardBet;
            }
            data.players_data.push(tempPlayer);
        });
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
        game_engine.handleStartTurn(Game);
    },
    pushPickDealerCardSelection: (Game, choiceInfo) => {
        Game.cardBets.push(choiceInfo);
        if (Game.cardBets.length === Game.players.length) {
            game_controls.determineFirstDealer(Game);
            game_controls.prepMainGameInitialState(Game);
        }
    }
};

module.exports = game_engine;