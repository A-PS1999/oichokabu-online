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
    Game.players[firstDealerIndex].isDealer = true;
    Game.currentDealer = currentDealer;
    Game.currentDealer.cardBet.push(Game.deck.pop());
    
    if (Game.currentPlayer === currentDealer) {
        Game.currentPlayerIndex = (Game.currentPlayerIndex + 1) % Game.playerCount;
        Game.currentPlayer = Game.players[Game.currentPlayerIndex];
    }
}