module.exports = (Game) => {
    const determineHighestValueCard = () => {
        let highestValueSelection = Game.cardBets.reduce((previous, current) => 
            current.cardVal > previous.cardVal ? current : previous
        )
        return highestValueSelection.userId;
    }

    const toBecomeFirstDealer = determineHighestValueCard();
    const firstDealerIndex = Game.players.findIndex(player => player.id === toBecomeFirstDealer);
    Game.currentDealerIndex = firstDealerIndex;
    const currentDealer = Game.players[firstDealerIndex];

    if (Game.currentPlayer === currentDealer) {
        Game.currentPlayerIndex = (Game.currentPlayerIndex + 1) % Game.playerCount;
        Game.currentPlayer = Game.players[Game.currentPlayerIndex];
    }

    Game.players[firstDealerIndex].isDealer = true;
    Game.currentDealer = currentDealer;
    const firstDealerCard = Game.deck.pop();
    firstDealerCard.userId = currentDealer.id;
    Game.currentDealer.cardBet.push(firstDealerCard);
}