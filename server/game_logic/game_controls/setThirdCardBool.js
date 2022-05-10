module.exports = (Game) => {
    const nonDealerPlayers = Game.players.filter(player => player.isDealer !== true);
    const nonBetPlayers = nonDealerPlayers.filter(player => Game.cardBets.find(bet => (bet.userId !== player.id)));

    for (let i = 0; i < nonBetPlayers.length; i++) {
        let playerIndex = Game.players.findIndex(player => player.id === nonBetPlayers[i].id);

        Game.players[playerIndex].thirdCardChosen = false;
    }
}