import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderGame } from "../../../test-utils";
import GameBoard from "./GameBoard";

const players = [
    { id: 1, username: "hitoshi", chips: 500, isDealer: false, thirdCardChosen: null },
    { id: 2, username: "hamada", chips: 500, isDealer: true, thirdCardChosen: null },
];

const currentDealer = { id: 2, username: "hamada", chips: 500, cardBet: [{ id: 21, value: 5, src: "/d.jpg" }], isDealer: true, thirdCardChosen: null, seat: 1 };

const currentPlayer = { id: 1, username: "hitoshi", chips: 500, cardBet: [], isDealer: false, thirdCardChosen: null, seat: 0 };

describe("GameBoard", () => {
    it("renders the betting form during bettingPhase", () => {
        renderGame({
            preloadedState: {
                modal: { isOpen: true },
                game: {
                    playerAuth: { id: 1, host: { host: false, ready: false } },
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [{ columnId: 0, cards: [{ id: 1, value: 7, src: "/c.jpg" }] }],
                    currentPhase: "bettingPhase",
                },
            },
            element: <GameBoard />,
        });
        expect(screen.getByText(/How much would you like to bet on this card/i)).toBeInTheDocument();
    });

    it("shows the third-card modal when a player column value is 4-6 with no third card", async () => {
        renderGame({
            preloadedState: {
                modal: { isOpen: false },
                game: {
                    playerAuth: { id: 1, host: { host: false, ready: false } },
                    Players: [
                        { id: 1, username: "hitoshi", chips: 500, isDealer: false, thirdCardChosen: null },
                        { id: 2, username: "hamada", chips: 500, isDealer: true, thirdCardChosen: null },
                    ],
                    currentPlayer,
                    currentDealer,
                    cardBets: [{ userId: 1, cardId: 1, ownerColumn: 0, betAmount: 100, value: 5 }],
                    cardsOnBoard: [
                        {
                            columnId: 0,
                            cards: [
                                { id: 1, value: 4, src: "/c1.jpg" },
                                { id: 2, value: 2, src: "/c2.jpg" },
                            ],
                        },
                    ],
                    currentPhase: "dealerCardsPhase",
                },
            },
            element: <GameBoard />,
        });

        await screen.findByText(/Would you like a third card/i);
    });

    it("renders round results during roundResults phase", () => {
        renderGame({
            preloadedState: {
                game: {
                    playerAuth: { id: 1, host: { host: false, ready: false } },
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [{ columnId: 0, cards: [{ id: 1, value: 7, src: "/c.jpg" }] }],
                    currentPhase: "roundResults",
                    lastRoundResult: {
                        turn: 1,
                        dealerId: 2,
                        dealerUsername: "hamada",
                        dealerHandValue: 5,
                        dealerYaku: false,
                        busted: [],
                        results: [
                            { userId: 1, username: "hitoshi", betAmount: 100, handValue: 8, yaku: false, delta: 100 },
                        ],
                    },
                },
            },
            element: <GameBoard />,
        });
        expect(screen.getByText(/Round 1 Results/)).toBeInTheDocument();
        expect(screen.getByText("+100")).toBeInTheDocument();
        expect(screen.queryByText(/How much would you like to bet on this card/i)).not.toBeInTheDocument();
    });

    it("renders dealer cards, columns, and players", () => {
        renderGame({
            preloadedState: {
                game: {
                    playerAuth: { id: 1, host: { host: false, ready: false } },
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [{ columnId: 0, cards: [{ id: 1, value: 7, src: "/c.jpg" }] }],
                    currentPhase: "bettingPhase",
                },
            },
            element: <GameBoard />,
        });
        expect(screen.getByText(/Current Player: hitoshi/)).toBeInTheDocument();
        expect(screen.getByText(/Dealer:/)).toHaveTextContent("hamada");
        expect(screen.getAllByText("hitoshi")).toHaveLength(1);
        expect(screen.getAllByText("hamada")).toHaveLength(2);
    });

    it("shows Loading when there are no columns", () => {
        renderGame({
            preloadedState: {
                game: {
                    playerAuth: { id: 1, host: { host: false, ready: false } },
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [],
                    currentPhase: "bettingPhase",
                },
            },
            element: <GameBoard />,
        });
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
});