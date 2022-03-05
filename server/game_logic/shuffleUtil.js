function shuffleDeck(cardsDeck) {
    let currentIndex = cardsDeck.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [cardsDeck[currentIndex], cardsDeck[randomIndex]] = [cardsDeck[randomIndex], cardsDeck[currentIndex]];
    }

    return cardsDeck;
}

module.exports = {
    shuffleDeck
}