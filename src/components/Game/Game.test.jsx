import { describe, it, expect } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { serverAddress } from "../../settings";
import { renderGame } from "../../test-utils";
import { emitToClient, setRejoinResponse } from "../../mocks/socketMock";

const playerAuth = { id: 1, host: { host: true } };

const players = [
    { id: 1, username: "hitoshi", chips: 500, isDealer: false },
    { id: 2, username: "hamada", chips: 500, isDealer: true },
];

const currentDealer = { id: 2, username: "hamada", cardBet: [{ id: 21, value: 5, src: "/d.jpg" }] };

const currentPlayer = { id: 1, username: "hitoshi" };

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
                        { cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
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
                    playerAuth: { id: 1, host: { host: false } },
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
                        dealerUsername: "hamada",
                        dealerHandValue: 8,
                        results: [],
                    },
                    playerAuth,
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [
                        { cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
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
                        { cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
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
                        { cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
                    ],
                },
                players_data: players,
            })
        );
        await screen.findByText(/Turn: 3\/12/);
    });

    it("navigates to /lobby and posts chips/remove-player on end-game event, idempotently", async () => {
        let updateChipsCalls = 0;
        let removePlayerCalls = 0;
        server.use(
            http.get(`${serverAddress}/api/game/:gameId/authenticate-player`, () => {
                return HttpResponse.json(playerAuth);
            }),
            http.post(`${serverAddress}/api/game/update-player-chips`, () => {
                updateChipsCalls += 1;
                return HttpResponse.json({});
            }),
            http.post(`${serverAddress}/api/game/:gameId/remove-player`, () => {
                removePlayerCalls += 1;
                return HttpResponse.json({});
            })
        );
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: false,
                    playerAuth,
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [
                        { cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
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
        expect(updateChipsCalls).toBe(1);
        expect(removePlayerCalls).toBe(1);
    });

    it("triggers endBustHandler when currentPhase is endGame", async () => {
        let updateChipsCalls = 0;
        let removePlayerCalls = 0;
        server.use(
            http.get(`${serverAddress}/api/game/:gameId/authenticate-player`, () => {
                return HttpResponse.json(playerAuth);
            }),
            http.post(`${serverAddress}/api/game/update-player-chips`, () => {
                updateChipsCalls += 1;
                return HttpResponse.json({});
            }),
            http.post(`${serverAddress}/api/game/:gameId/remove-player`, () => {
                removePlayerCalls += 1;
                return HttpResponse.json({});
            })
        );
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: false,
                    playerAuth,
                    Players: players,
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [
                        { cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
                    ],
                    currentPhase: "endGame",
                },
            },
        });

        await waitFor(() => {
            expect(screen.getByTestId("lobby-nav")).toBeInTheDocument();
        });
        expect(updateChipsCalls).toBe(1);
        expect(removePlayerCalls).toBe(1);
    });

    it("busts a player with chips below 100 during roundResults", async () => {
        let updateChipsCalls = 0;
        let removePlayerCalls = 0;
        server.use(
            http.get(`${serverAddress}/api/game/:gameId/authenticate-player`, () => {
                return HttpResponse.json(playerAuth);
            }),
            http.post(`${serverAddress}/api/game/update-player-chips`, () => {
                updateChipsCalls += 1;
                return HttpResponse.json({});
            }),
            http.post(`${serverAddress}/api/game/:gameId/remove-player`, () => {
                removePlayerCalls += 1;
                return HttpResponse.json({});
            })
        );
        renderGame({
            preloadedState: {
                game: {
                    isPickDealer: false,
                    playerAuth,
                    Players: [{ id: 1, username: "hitoshi", chips: 50, isDealer: false }],
                    currentPlayer,
                    currentDealer,
                    cardsOnBoard: [
                        { cards: [{ id: 1, value: 7, src: "/c.jpg" }] },
                    ],
                    currentPhase: "roundResults",
                },
            },
        });

        await waitFor(() => {
            expect(screen.getByTestId("lobby-nav")).toBeInTheDocument();
        });
        expect(updateChipsCalls).toBe(1);
        expect(removePlayerCalls).toBe(1);
    });
});