module.exports = ({ Game }) => {
    const checkForArashi = (cards) => {
        return cards.every(card => card.value === cards[0].value);
    }
    const checkForArashikabu = (cards) => {
        return cards.every(card => card.value === 3);
    }
    const checkForShippin = (cards) => {
        if (cards.length > 2) return false;
        if ((cards[0].value === 4 && cards[1].value === 1) || (cards[0].value === 1 && cards[1].value === 4)) {
            return true;
        }
    }
    const checkForNobori = (cards) => {
        if (cards.length < 3) return false;
        for (let i = 0; i < cards.length-1; i++) {
            if (cards[i+1].value !== cards[i].value+1) return false;
        }
        return true;
    }
    const checkForKudari = (cards) => {
        if (cards.length < 3) return false;
        for (let i = 0; i < cards.length-1; i++) {
            if (cards[i+1].value !== cards[i].value-1) return false;
        }
        return true;
    }

    const dealerCardsValue = Game.currentDealer.cardBet.reduce((sum, card) => {
        sum + card.value, 0
    });

}