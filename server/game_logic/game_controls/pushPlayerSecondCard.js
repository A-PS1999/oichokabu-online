const pushPlayerThirdCard = require('./pushPlayerThirdCard');

module.exports = ({ Game }) => {
    const betPlayers = Game.players.filter(player => Game.cardBets.find(bet => (bet.userId === player.id)));
    for (let i = 0; i < betPlayers.length; i++) {
        let secondCard = Game.deck.pop();
        let playerIndex = Game.players.findIndex(player => player.id === betPlayers[i].id);

        for (let j = 0; j < 4; j++) {
            if (Game.cardsOnBoard[j].columnId === Game.players[playerIndex].cardBet[0].ownerColumn) {
                Game.cardsOnBoard[j].cards.push(secondCard);
            }
        }

        Game.players[playerIndex].cardBet.push(secondCard);

        if ((Game.players[playerIndex].cardBet[0].value + secondCard.value) % 10 <= 3) {
            pushPlayerThirdCard({ Game, playerIndex });
        } else if ((Game.players[playerIndex].cardBet[0].value + secondCard.value) % 10 >= 7) {
            Game.players[playerIndex].thirdCardChosen = false;
        }
    }
    Game.currentPhase = "decideThirdCardPhase";
}