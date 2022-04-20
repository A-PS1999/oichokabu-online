const startGame = require('./startGame');
const startTurn = require('./startTurn');
const determineFirstDealer = require('./determineFirstDealer');
const prepMainGameInitialState = require('./prepMainGameInitialState');
const handleCardBet = require('./handleCardBet');
const pushSecondCard = require('./pushSecondCard');
const pushThirdCard = require('./pushThirdCard');
const checkThirdCardsStatus = require('./checkThirdCardsStatus');

module.exports = {
    startGame,
    startTurn,
    determineFirstDealer,
    prepMainGameInitialState,
    handleCardBet,
    pushSecondCard,
    pushThirdCard,
    checkThirdCardsStatus,
}