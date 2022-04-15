module.exports = (Game) => {
    const nonDealerPlayers = Game.players.filter(player => player.isDealer !== true);

    for (let i = 0; i < nonDealerPlayers.length; i++) {
        let secondCard = Game.deck.pop();
        let playerIndex = Game.players.findIndex(player => player.id === nonDealerPlayers[i].id);

        for (let j = 0; j < 4; j++) {
            if (Game.cardsOnBoard[j].columnId === Game.players[playerIndex].cardBet[0].ownerColumn) {
                Game.cardsOnBoard[j].cards.push(secondCard);
            }
        }

        Game.players[playerIndex].cardBet.push(secondCard);
    }
}