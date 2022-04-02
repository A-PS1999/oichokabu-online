const globalGameDetails = require('../globalGameDetails');

module.exports = ({ ok_users }, constants) => {
    let Game = globalGameDetails(ok_users, constants);
    for (let i = 0; i < ok_users.length; i++) {
        Game.pickDealerCardsArray.push(Game.deck.pop());
    }
    return Game;
}