const pushDealerThirdCard = require('./pushDealerThirdCard');

module.exports = ({ Game, dealer }) => {
    dealer.cardBet.push(Game.deck.pop());

    if ((dealer.cardBet[0].value + dealer.cardBet[1].value) % 10 <= 3) {
        pushDealerThirdCard({ Game, dealer });
    } else if ((dealer.cardBet[0].value + dealer.cardBet[1].value) % 10 >= 7) {
        dealer.thirdCardChosen = false;
    }
}