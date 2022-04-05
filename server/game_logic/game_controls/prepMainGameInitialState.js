module.exports = (Game) => {
    Game.cardBets = [];
    Game.isPickDealer = false;
    Game.pickDealerCardsArray = [];
    Game.currentPhase = 'bettingPhase';
    for (let i = 0; i < 4; i++) {
        let cardColumn = { columnId: i, cards: [Game.deck.pop()] }
        Game.cardsOnBoard[i] = cardColumn;
    }
}