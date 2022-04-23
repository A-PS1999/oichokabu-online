module.exports = ({ Game, playerIndex }) => {
    const thirdCard = Game.deck.pop();

    for (let j = 0; j < 4; j++) {
        if (Game.cardsOnBoard[j].columnId === Game.players[playerIndex].cardBet[0].ownerColumn) {
            Game.cardsOnBoard[j].cards.push(thirdCard);
        }
    }

    Game.players[playerIndex].thirdCardChosen = true;
    Game.players[playerIndex].cardBet.push(thirdCard);
}