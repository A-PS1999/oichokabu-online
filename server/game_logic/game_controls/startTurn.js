const nextPlayerBySeat = require('./nextPlayerBySeat');

module.exports = ({ Game, player }) => {
    if (Game.currentDealer && (player.id === Game.currentDealer.id)) {
        Game.currentPlayer = nextPlayerBySeat(Game, player.seat);
    }
}