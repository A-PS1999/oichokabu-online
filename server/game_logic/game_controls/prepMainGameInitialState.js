module.exports = (Game) => {
    Game.cardBets = [];
    Game.isPickDealer = false;
    Game.pickDealerCardsArray = [];
    Game.currentPhase = 'bettingPhase';
}