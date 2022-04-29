module.exports = (Game, playerId) => {
    Game.players = Game.players.filter(player => player.id !== playerId);
    Game.playerCount--;
}