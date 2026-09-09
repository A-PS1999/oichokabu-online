const handValue = cards => cards.reduce((sum, card) => (sum + card.value) % 10, 0);

module.exports = ({ Game }) => {
    const checkForArashi = (cards) => {
        if (cards.length < 3) return false;
        if (cards.every(card => card.value === cards[0].value)) {
          return 'arashi'
        } else return false;
      }
      const checkForArashikabu = (cards) => {
        if (cards.length < 3) return false;
        if (cards.every(card => card.value === 3)) {
          return 'arashi kabu'
        } else return false;
      }
    const checkForShippin = (cards) => {
        if (cards.length > 2) return false;
        if ((cards[0].value === 4 && cards[1].value === 1) || (cards[0].value === 1 && cards[1].value === 4)) {
            return true;
        } else return false;
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
    const checkForYaku = (cards) => {
        return checkForArashikabu(cards) ||
            checkForArashi(cards) ||
            checkForNobori(cards) ||
            checkForKudari(cards) ||
            checkForShippin(cards)
    }

    const nonDealerPlayers = Game.players.filter(player => player.isDealer !== true);

    const dealerCards = Game.currentDealer.cardBet;
    const dealerCardsValue = handValue(dealerCards);
    const dealerYakuBool = checkForYaku(dealerCards);

    const chipsBefore = {};
    for (let i = 0; i < nonDealerPlayers.length; i++) {
        chipsBefore[nonDealerPlayers[i].id] = nonDealerPlayers[i].chips;
    }

    for (let i = 0; i < nonDealerPlayers.length; i++) {
        let playerCards = nonDealerPlayers[i].cardBet;
        let playerCardsValue = handValue(playerCards);
        let playerBet = Game.cardBets.find(bet => bet.userId === nonDealerPlayers[i].id);
        let playerYakuBool = checkForYaku(playerCards);
        
        if (playerYakuBool === true || playerYakuBool === 'arashi' || playerYakuBool === 'arashi kabu') {
            if (dealerYakuBool === false) {
                if (playerYakuBool === true) {
                    Game.currentDealer.chips -= playerBet.betAmount;
                    nonDealerPlayers[i].chips += (playerBet.betAmount + (playerBet.betAmount * 2));
                }
                if (playerYakuBool === 'arashi') {
                    Game.currentDealer.chips -= playerBet.betAmount;
                    nonDealerPlayers[i].chips += (playerBet.betAmount + (playerBet.betAmount * 3));
                }
                if (playerYakuBool === 'arashi kabu') {
                    Game.currentDealer.chips -= playerBet.betAmount;
                    nonDealerPlayers[i].chips += (playerBet.betAmount + (playerBet.betAmount * 5));
                }
            } else {
                if (dealerYakuBool === 'arashi' && playerYakuBool === 'arashi') {
                    if (dealerCardsValue >= playerCardsValue) {
                        Game.currentDealer.chips += (playerBet.betAmount * 3);
                    } else {
                        Game.currentDealer.chips -= playerBet.betAmount;
                        nonDealerPlayers[i].chips += (playerBet.betAmount + (playerBet.betAmount * 3));
                    }
                }
                if ((dealerYakuBool === 'arashi' || dealerYakuBool === true) && playerYakuBool === 'arashi kabu') {
                    Game.currentDealer.chips -= playerBet.betAmount;
                    nonDealerPlayers[i].chips += (playerBet.betAmount + (playerBet.betAmount * 5));
                }
                if (dealerYakuBool === true) {
                    Game.currentDealer.chips += (playerBet.betAmount * 2);
                }
                if (dealerYakuBool === 'arashi') {
                    Game.currentDealer.chips += (playerBet.betAmount * 3);
                }
                if (dealerYakuBool === 'arashi kabu') {
                    Game.currentDealer.chips += (playerBet.betAmount * 5);
                }
            }
        } else if (playerYakuBool === false && (dealerYakuBool === true || dealerYakuBool === 'arashi' || dealerYakuBool === 'arashi kabu')) {
            if (dealerYakuBool === true) {
                Game.currentDealer.chips += (playerBet.betAmount * 2);
            }
            if (dealerYakuBool === 'arashi') {
                Game.currentDealer.chips += (playerBet.betAmount * 3);
            }
            if (dealerYakuBool === 'arashi kabu') {
                Game.currentDealer.chips += (playerBet.betAmount * 5);
            }
        } else {
            if (dealerCardsValue >= playerCardsValue) {
                Game.currentDealer.chips += playerBet.betAmount;
            } else {
                Game.currentDealer.chips -= playerBet.betAmount;
                nonDealerPlayers[i].chips += (playerBet.betAmount + playerBet.betAmount);
            }
        }
    }

    Game.lastRoundResult = {
        turn: Game.currentTurn,
        dealerId: Game.currentDealer.id,
        dealerUsername: Game.currentDealer.username,
        dealerHandValue: dealerCardsValue,
        dealerYaku: dealerYakuBool,
        results: nonDealerPlayers.map(player => {
            let playerBet = Game.cardBets.find(bet => bet.userId === player.id);
            let betAmount = playerBet ? playerBet.betAmount : 0;
            return {
                userId: player.id,
                username: player.username,
                betAmount,
                handValue: handValue(player.cardBet),
                yaku: checkForYaku(player.cardBet),
                delta: (player.chips - chipsBefore[player.id]) - betAmount,
            };
        }),
    };
}