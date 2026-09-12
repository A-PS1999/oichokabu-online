const nextPlayerBySeat = require('./nextPlayerBySeat');

module.exports = (Game) => {
    const determineHighestValueCard = () => {
        let highestValueSelection = Game.cardBets.reduce((previous, current) => 
            current.cardVal > previous.cardVal ? current : previous
        )
        return highestValueSelection.userId;
    }

    const toBecomeFirstDealer = determineHighestValueCard();
    const firstDealerIndex = Game.players.findIndex(player => player.id === toBecomeFirstDealer);
    const currentDealer = Game.players[firstDealerIndex];

    if (Game.currentPlayer === currentDealer) {
        Game.currentPlayer = nextPlayerBySeat(Game, currentDealer.seat);
    }

    Game.players[firstDealerIndex].isDealer = true;
    Game.currentDealer = currentDealer;
    const firstDealerCard = Game.deck.pop();
    Game.currentDealer.cardBet.push(firstDealerCard);
}