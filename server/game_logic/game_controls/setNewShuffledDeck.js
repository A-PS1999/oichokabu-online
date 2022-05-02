const kabufudaDeck = require('../cardsDeck');

module.exports = ({ Game }) => {
    Game.deck = [];
    for (let i = 0; i < kabufudaDeck.length; i++) {
        let card = {
            id: kabufudaDeck[i].id,
            value: kabufudaDeck[i].value,
            src: kabufudaDeck[i].src
        }
        Game.deck.push(card);
    }
    Game.deck = Game.shuffle(Game.deck);
}