module.exports = ({ Game }) => {
    const nonDealerPlayers = Game.players.filter(player => player.isDealer !== true);
    return nonDealerPlayers.every(player => player.thirdCardChosen !== null)
}