const nextPlayerBySeat = require('./nextPlayerBySeat');

module.exports = ({ Game }) => {
    const oldDealerSeat = Game.currentDealer.seat;
    Game.currentDealer.isDealer = null;
    Game.currentDealer = nextPlayerBySeat(Game, oldDealerSeat);
    Game.currentDealer.isDealer = true;
    Game.currentDealer.cardBet.push(Game.deck.pop());
}