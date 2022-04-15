module.exports = ({ Game, player }) => {
    if (Game.currentDealer && (player.id === Game.currentDealer.id)) {
        Game.currentPlayerIndex = (Game.currentPlayerIndex + 1) % Game.playerCount;
        Game.currentPlayer = Game.players[Game.currentPlayerIndex];
    }
}