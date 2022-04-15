const kabufudaDeck = require('../cardsDeck');

module.exports = (Game, player, betInfo) => {
    const chosenCard = kabufudaDeck.find(card => card.id === betInfo.cardId);
    const cardValue = chosenCard.value;
    betInfo.value = cardValue;

    Game.currentOverallBet += betInfo.betAmount;
    player.chips -= betInfo.betAmount;

    player.cardBet.push(betInfo);
    Game.cardBets.push(betInfo);
}