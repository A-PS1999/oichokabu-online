module.exports = ({ Game }) => {
    const thirdCardsAllDealt = Game.players.every(player => player.thirdCardChosen !== null);
    return thirdCardsAllDealt;
}