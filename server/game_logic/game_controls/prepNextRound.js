const setNewShuffledDeck = require('./setNewShuffledDeck');
const determineNextDealer = require('./determineNextDealer');

module.exports = ({ Game }) => {
    Game.currentTurn++;
    Game.currentOverallBet = 0;
    Game.cardBets = [];

    for (let i = 0; i < Game.players.length; i++) {
        Game.players[i].cardBet = [];
        Game.players[i].thirdCardChosen = null;
    }
    if (Game.deck.length <= 12) {
        setNewShuffledDeck({ Game });
    }
    determineNextDealer({ Game });
    for (let i = 0; i < 4; i++) {
        Game.cardsOnBoard[i].cards = [Game.deck.pop()];
    }
}