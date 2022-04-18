module.exports = (Game, playerIndex) => {
    Game.players[playerIndex].cardBet.push(Game.deck.pop());
}