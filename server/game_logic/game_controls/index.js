const startGame = require('./startGame');
const startTurn = require('./startTurn');
const determineFirstDealer = require('./determineFirstDealer');
const prepMainGameInitialState = require('./prepMainGameInitialState');
const handleCardBet = require('./handleCardBet');
const pushPlayerSecondCard = require('./pushPlayerSecondCard');
const pushDealerSecondCard = require('./pushDealerSecondCard');
const pushPlayerThirdCard = require('./pushPlayerThirdCard');
const pushDealerThirdCard = require('./pushDealerThirdCard');
const checkPlayersThirdCardsStatus = require('./checkPlayersThirdCardsStatus');
const checkAllThirdCardsStatus = require('./checkAllThirdCardsStatus');
const resolveBets = require('./resolveBets');
const removePlayer = require('./removePlayer');
const prepNextRound = require('./prepNextRound');
const setNewShuffledDeck = require('./setNewShuffledDeck');
const determineNextDealer = require('./determineNextDealer');

module.exports = {
    startGame,
    startTurn,
    determineFirstDealer,
    prepMainGameInitialState,
    handleCardBet,
    pushPlayerSecondCard,
    pushDealerSecondCard,
    pushPlayerThirdCard,
    pushDealerThirdCard,
    checkPlayersThirdCardsStatus,
    checkAllThirdCardsStatus,
    resolveBets,
    removePlayer,
    prepNextRound,
    setNewShuffledDeck,
    determineNextDealer,
}