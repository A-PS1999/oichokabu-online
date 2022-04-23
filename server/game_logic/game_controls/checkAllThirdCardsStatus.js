module.exports = ({ Game }) => {
    return Game.players.every(player => player.thirdCardChosen !== null);
}