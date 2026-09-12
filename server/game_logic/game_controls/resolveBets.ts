import type { Card, CardBet, GameState, YakuResult } from '../types';

type Cards = ReadonlyArray<CardBet | Card>;

const handValue = (cards: Cards): number => cards.reduce((sum, card) => (sum + card.value) % 10, 0);

const checkForArashi = (cards: Cards): 'arashi' | boolean => {
    if (cards.length < 3) return false;
    const first = cards[0];
    if (!first) return false;
    if (cards.every(card => card.value === first.value)) {
        return 'arashi';
    }
    return false;
};

const checkForArashikabu = (cards: Cards): 'arashi kabu' | boolean => {
    if (cards.length < 3) return false;
    if (cards.every(card => card.value === 3)) {
        return 'arashi kabu';
    }
    return false;
};

const checkForShippin = (cards: Cards): boolean => {
    if (cards.length !== 2) return false;
    const first = cards[0];
    const second = cards[1];
    if (!first || !second) return false;
    return (first.value === 4 && second.value === 1) || (first.value === 1 && second.value === 4);
};

const checkForNobori = (cards: Cards): boolean => {
    if (cards.length < 3) return false;
    for (let i = 0; i < cards.length - 1; i++) {
        const current = cards[i];
        const next = cards[i + 1];
        if (!current || !next) return false;
        if (next.value !== current.value + 1) return false;
    }
    return true;
};

const checkForKudari = (cards: Cards): boolean => {
    if (cards.length < 3) return false;
    for (let i = 0; i < cards.length - 1; i++) {
        const current = cards[i];
        const next = cards[i + 1];
        if (!current || !next) return false;
        if (next.value !== current.value - 1) return false;
    }
    return true;
};

const checkForYaku = (cards: Cards): YakuResult =>
    checkForArashikabu(cards) ||
    checkForArashi(cards) ||
    checkForNobori(cards) ||
    checkForKudari(cards) ||
    checkForShippin(cards);

const findBet = (Game: GameState, userId: number): CardBet | undefined =>
    Game.cardBets.find(bet => bet.userId === userId) as CardBet | undefined;

export const resolveBets = ({ Game }: { Game: GameState }): void => {
    const dealer = Game.currentDealer;
    if (!dealer) throw new Error('Cannot resolve bets without a dealer');

    const nonDealerPlayers = Game.players.filter(player => player.isDealer !== true);

    const dealerCards = dealer.cardBet;
    const dealerCardsValue = handValue(dealerCards);
    const dealerYakuBool = checkForYaku(dealerCards);

    const chipsBefore: Record<number, number> = {};
    for (let i = 0; i < nonDealerPlayers.length; i++) {
        const player = nonDealerPlayers[i];
        if (!player) continue;
        chipsBefore[player.id] = player.chips;
    }

    for (let i = 0; i < nonDealerPlayers.length; i++) {
        const player = nonDealerPlayers[i];
        if (!player) continue;

        const playerCards = player.cardBet;
        const playerCardsValue = handValue(playerCards);
        const playerBet = findBet(Game, player.id);
        const playerYakuBool = checkForYaku(playerCards);

        if (playerYakuBool === true || playerYakuBool === 'arashi' || playerYakuBool === 'arashi kabu') {
            if (dealerYakuBool === false) {
                if (!playerBet) throw new Error(`No bet found for player ${player.id}`);
                if (playerYakuBool === true) {
                    dealer.chips -= playerBet.betAmount;
                    player.chips += playerBet.betAmount + playerBet.betAmount * 2;
                }
                if (playerYakuBool === 'arashi') {
                    dealer.chips -= playerBet.betAmount;
                    player.chips += playerBet.betAmount + playerBet.betAmount * 3;
                }
                if (playerYakuBool === 'arashi kabu') {
                    dealer.chips -= playerBet.betAmount;
                    player.chips += playerBet.betAmount + playerBet.betAmount * 5;
                }
            } else {
                if (!playerBet) throw new Error(`No bet found for player ${player.id}`);
                if (dealerYakuBool === 'arashi' && playerYakuBool === 'arashi') {
                    if (dealerCardsValue >= playerCardsValue) {
                        dealer.chips += playerBet.betAmount * 3;
                    } else {
                        dealer.chips -= playerBet.betAmount;
                        player.chips += playerBet.betAmount + playerBet.betAmount * 3;
                    }
                }
                if ((dealerYakuBool === 'arashi' || dealerYakuBool === true) && playerYakuBool === 'arashi kabu') {
                    dealer.chips -= playerBet.betAmount;
                    player.chips += playerBet.betAmount + playerBet.betAmount * 5;
                }
                if (dealerYakuBool === true) {
                    dealer.chips += playerBet.betAmount * 2;
                }
                if (dealerYakuBool === 'arashi') {
                    dealer.chips += playerBet.betAmount * 3;
                }
                if (dealerYakuBool === 'arashi kabu') {
                    dealer.chips += playerBet.betAmount * 5;
                }
            }
        } else if (playerYakuBool === false && (dealerYakuBool === true || dealerYakuBool === 'arashi' || dealerYakuBool === 'arashi kabu')) {
            if (!playerBet) throw new Error(`No bet found for player ${player.id}`);
            if (dealerYakuBool === true) {
                dealer.chips += playerBet.betAmount * 2;
            }
            if (dealerYakuBool === 'arashi') {
                dealer.chips += playerBet.betAmount * 3;
            }
            if (dealerYakuBool === 'arashi kabu') {
                dealer.chips += playerBet.betAmount * 5;
            }
        } else {
            if (!playerBet) throw new Error(`No bet found for player ${player.id}`);
            if (dealerCardsValue >= playerCardsValue) {
                dealer.chips += playerBet.betAmount;
            } else {
                dealer.chips -= playerBet.betAmount;
                player.chips += playerBet.betAmount + playerBet.betAmount;
            }
        }
    }

    Game.lastRoundResult = {
        turn: Game.currentTurn,
        dealerId: dealer.id,
        dealerUsername: dealer.username,
        dealerHandValue: dealerCardsValue,
        dealerYaku: dealerYakuBool,
        busted: [],
        results: nonDealerPlayers.map(player => {
            const playerBet = findBet(Game, player.id);
            const betAmount = playerBet ? playerBet.betAmount : 0;
            return {
                userId: player.id,
                username: player.username,
                betAmount,
                handValue: handValue(player.cardBet),
                yaku: checkForYaku(player.cardBet),
                delta: (player.chips - (chipsBefore[player.id] ?? 0)) - betAmount,
            };
        }),
    };
};