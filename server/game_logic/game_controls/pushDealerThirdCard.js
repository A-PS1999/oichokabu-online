module.exports = ({ Game, dealer }) => {
    dealer.cardBet.push(Game.deck.pop());
    dealer.thirdCardChosen = true;
}