module.exports = ({ Game }) => {
    Game.currentDealer.isDealer = null;
    Game.currentDealerIndex = (Game.currentDealerIndex + 1) % Game.playerCount;
    Game.currentDealer = Game.players[Game.currentDealerIndex];
    Game.currentDealer.isDealer = true;
    Game.currentDealer.cardBet.push(Game.deck.pop());
}