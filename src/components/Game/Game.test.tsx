import { describe, it, expect } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { serverAddress } from "../../settings";
import { renderGame } from "../../test-utils";
import { emitToClient, setRejoinResponse } from "../../mocks/socketMock";
import type { PlayerAuth } from "@shared/api";
import type { Player, PlayerDataView, CardColumn, RoundResult } from "@shared/game";

const playerAuth: PlayerAuth = { id: 1, host: { host: true, ready: false } };

const players: PlayerDataView[] = [
    { id: 1, username: "hitoshi", chips: 500, isDealer: false, thirdCardChosen: null },
    { id: 2, username: "hamada", chips: 500, isDealer: true, thirdCardChosen: null },
];

const currentDealer: Player = {
    id: 2,
    username: "hamada",
    chips: 500,
    cardBet: [{ id: 21, value: 5, src: "/d.jpg" }],
    isDealer: true,
    thirdCardChosen: null,
    seat: 1,
};

const currentPlayer: Player = {
    id: 1,
    username: "hitoshi",
    chips: 500,
    cardBet: [],
    isDealer: false,
    thirdCardChosen: null,
    seat: 0,
};

function useAuthHandler() {
    server.use(
        http.get(`${serverAddress}/api/game/:gameId/authenticate-player`, () => {
            return HttpResponse.json(playerAuth);
        })
    );
}

describe("Game", () => {
    it("renders PickDealerScreen when isPickDealer is true", async () => {
        useAuthHandler();
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: true,
                    playerAuth,
                    Players: players,
                    pickDealerCards: [
                        { id: 10, src: "/cards/c1.jpg", value: 5 },
                        { id: 11, src: "/cards/c2.jpg", value: 3 },
                    ],
                },
            },
        });

        await screen.findByText(/Click one face-down card to turn it over/i);
    });

    it("renders GameBoard when isPickDealer is false", async () => {
        useAuthHandler();
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: false,
                    playerAuth,
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [
                        { columnId: 0, cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
                    ],
                    currentPhase: "bettingPhase",
                },
            },
        });

        await screen.findByText(/Turn: 1\/12/);
        expect(screen.getByText(/Current Player: hitoshi/)).toBeInTheDocument();
        expect(screen.getByText(/Dealer:/)).toHaveTextContent("hamada");
    });

    it("renders StartScreen with Start button for host when isPickDealer is null", async () => {
        useAuthHandler();
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: null,
                    playerAuth,
                    Players: players,
                },
            },
        });

        await screen.findByRole("button", { name: /start game/i });
    });

    it("renders waiting text for non-host on StartScreen", async () => {
        server.use(
            http.get(`${serverAddress}/api/game/:gameId/authenticate-player`, () => {
                return HttpResponse.json({ id: 1, host: { host: false } });
            })
        );
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: null,
                    playerAuth: { id: 1, host: { host: false, ready: false } },
                    Players: players,
                },
            },
        });

        await screen.findByText(/Waiting for the host to start the game/i);
    });

    it("shows an error toast when isError is set", async () => {
        useAuthHandler();
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: null,
                    playerAuth,
                    Players: players,
                    isError: true,
                    errorMessage: "game boom",
                },
            },
        });

        await screen.findByText(/game boom/);
    });

    it("clears stale game state from a previous game when entering a new gameId", async () => {
        useAuthHandler();
        renderGame({
            gameId: "4",
            preloadedState: {
                game: {
                    gameId: "3",
                    isPickDealer: false,
                    currentPhase: "roundResults",
                    currentTurn: 6,
                    turnMax: 6,
                    lastRoundResult: {
                        turn: 6,
                        dealerId: 2,
                        dealerUsername: "hamada",
                        dealerHandValue: 8,
                        dealerYaku: false,
                        busted: [],
                        results: [],
                    },
                    playerAuth,
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [
                        { columnId: 0, cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
                    ],
                },
            },
        });

        expect(screen.queryByText(/Round 6 Results/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Turn: 6\/6/)).not.toBeInTheDocument();
        await screen.findByText(/Waiting for the host to start the game/i);
    });

    it("navigates to /lobby and toasts when game:rejoin ack is { ok: false }", async () => {
        useAuthHandler();
        setRejoinResponse(false, "bust");
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: null,
                    playerAuth,
                    Players: players,
                },
            },
        });

        await waitFor(() => {
            expect(screen.getByTestId("lobby-nav")).toBeInTheDocument();
        });
        expect(screen.getByText(/Failed to join game/)).toBeInTheDocument();
    });

    it("dispatches setGameState on update-game event", async () => {
        useAuthHandler();
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: false,
                    playerAuth,
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [
                        { columnId: 0, cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
                    ],
                },
            },
        });

        await screen.findByText(/Turn: 1\/12/);
        act(() =>
            emitToClient("game:1:update-game", {
general_data: {
                    betMax: 500,
                    currentTurn: 3,
                    turnMax: 12,
                    currentOverallBet: 0,
                    isPickDealer: false,
                    currentPlayer,
                    currentPhase: "bettingPhase",
                    currentDealer,
                    cardBets: [],
                    cardsOnBoard: [
                        { columnId: 0, cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
                    ],
                    phaseEnteredAt: 0,
                    phaseDurationMs: null,
                },
                players_data: players,
            })
        );
        await screen.findByText(/Turn: 3\/12/);
    });

    it("navigates to /lobby on end-game event, idempotently", async () => {
        useAuthHandler();
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: false,
                    playerAuth,
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [
                        { columnId: 0, cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
                    ],
                },
            },
        });

        await screen.findByText(/Turn: 1\/12/);
        act(() => emitToClient("game:1:end-game"));
        act(() => emitToClient("game:1:end-game"));
        await waitFor(() => {
            expect(screen.getByTestId("lobby-nav")).toBeInTheDocument();
        });
    });

    it("navigates to /lobby when currentPhase is endGame", async () => {
        useAuthHandler();
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: false,
                    playerAuth,
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [
                        { columnId: 0, cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
                    ],
                    currentPhase: "endGame",
                },
            },
        });

        await waitFor(() => {
            expect(screen.getByTestId("lobby-nav")).toBeInTheDocument();
        });
    });

    it("navigates to /lobby and toasts on player-busted event", async () => {
        useAuthHandler();
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: false,
                    playerAuth,
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [
                        { columnId: 0, cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
                    ],
                    currentPhase: "roundResults",
                },
            },
        });

        await screen.findByText(/Turn: 1\/12/);
        act(() => emitToClient("game:1:player-busted", { userId: 1, username: "hitoshi", chips: 50 }));
        await waitFor(() => {
            expect(screen.getByTestId("lobby-nav")).toBeInTheDocument();
        });
        expect(screen.getByText(/You busted/)).toBeInTheDocument();
    });
});