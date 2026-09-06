import { describe, it, expect } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { serverAddress } from "../../settings";
import { renderWithProviders } from "../../test-utils";
import { emitToClient, setRejoinResponse } from "../../mocks/socketMock";
import PregameLobby from "./PregameLobby.jsx";

const playerInfo = {
    room_name: "my-game",
    player_cap: 2,
    turn_max: 12,
    bet_max: 500,
};

const playerStatuses = [
    {
        id: 1,
        username: "hitoshi",
        user_chips: 500,
        Players: [{ host: true, ready: true }],
    },
    {
        id: 2,
        username: "hamada",
        user_chips: 500,
        Players: [{ host: false, ready: false }],
    },
];

function preloadedPregame() {
    return {
        pregame: {
            ready: false,
            playerInfo,
            playerStatuses,
            gameStatus: null,
            isFetching: false,
            isError: false,
            errorMessage: "",
        },
    };
}

function renderPregame(gameId = "3", userId = 5) {
    return renderWithProviders(<PregameLobby />, {
        initialEntries: [{ pathname: `/pregame-lobby/${gameId}`, state: { user_id: userId } }],
        routes: [
            { path: "/pregame-lobby/:gameId", element: <PregameLobby /> },
            { path: "/lobby", element: <div data-testid="lobby-nav">LOBBY</div> },
            { path: "/game/:gameId", element: <div data-testid="game-nav">GAME</div> },
        ],
        preloadedState: {
            ...preloadedPregame(),
            lobby: {
                userId,
                chips: 10000,
                rooms: [],
                isFetching: false,
                isSuccessful: false,
                isError: false,
                errorMessage: "",
            },
        },
    });
}

describe("PregameLobby", () => {
    it("renders player statuses and room info", async () => {
        server.use(
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-info`, () => {
                return HttpResponse.json(playerInfo);
            }),
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-status`, () => {
                return HttpResponse.json(playerStatuses);
            })
        );
        renderPregame();

        await screen.findByText("my-game");
        expect(screen.getByText("hitoshi")).toBeInTheDocument();
        expect(screen.getByText("hamada")).toBeInTheDocument();
        expect(screen.getByText(/2\/2/)).toBeInTheDocument();
        expect(screen.getByText(/12 turns/)).toBeInTheDocument();
        expect(screen.getAllByText(/Chips: 500/)).toHaveLength(2);
    });

    it("shows an error toast when pregame:rejoin ack is { ok: false }", async () => {
        server.use(
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-info`, () => {
                return HttpResponse.json(playerInfo);
            }),
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-status`, () => {
                return HttpResponse.json(playerStatuses);
            })
        );
        setRejoinResponse(false, "not allowed");
        renderPregame();

        await waitFor(() => {
            expect(screen.getByText(/failed to join lobby/i)).toBeInTheDocument();
        });
    });

    it("refetches statuses on player-ready event", async () => {
        let statusCalls = 0;
        server.use(
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-info`, () => {
                return HttpResponse.json(playerInfo);
            }),
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-status`, () => {
                statusCalls += 1;
                return HttpResponse.json(playerStatuses);
            })
        );
        renderPregame();

        await screen.findByText("my-game");
        const callsBefore = statusCalls;
        act(() => emitToClient(`pregame-lobby:3:player-ready`));
        await waitFor(() => {
            expect(statusCalls).toBeGreaterThan(callsBefore);
        });
    });

    it("refetches statuses on player-unready and enter-game events", async () => {
        let statusCalls = 0;
        server.use(
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-info`, () => {
                return HttpResponse.json(playerInfo);
            }),
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-status`, () => {
                statusCalls += 1;
                return HttpResponse.json(playerStatuses);
            })
        );
        renderPregame();

        await screen.findByText("my-game");
        const callsBefore = statusCalls;
        act(() => emitToClient(`pregame-lobby:3:player-unready`));
        act(() => emitToClient(`pregame-lobby:3:enter-game`));
        await waitFor(() => {
            expect(statusCalls).toBeGreaterThan(callsBefore);
        });
    });

    it("navigates to /lobby on leave-game when own userId matches", async () => {
        server.use(
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-info`, () => {
                return HttpResponse.json(playerInfo);
            }),
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-status`, () => {
                return HttpResponse.json(playerStatuses);
            })
        );
        renderPregame("3", 5);

        await screen.findByText("my-game");
        act(() =>
            emitToClient("pregame-lobby:3:leave-game", { userId: 5, hostStatus: false })
        );
        await waitFor(() => {
            expect(screen.getByTestId("lobby-nav")).toBeInTheDocument();
        });
    });

    it("navigates to /lobby on leave-game when hostStatus is true", async () => {
        server.use(
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-info`, () => {
                return HttpResponse.json(playerInfo);
            }),
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-status`, () => {
                return HttpResponse.json(playerStatuses);
            })
        );
        renderPregame("3", 99);

        await screen.findByText("my-game");
        act(() =>
            emitToClient("pregame-lobby:3:leave-game", { userId: 1, hostStatus: true })
        );
        await waitFor(() => {
            expect(screen.getByTestId("lobby-nav")).toBeInTheDocument();
        });
    });

    it("navigates to /game/:id on start-game event", async () => {
        server.use(
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-info`, () => {
                return HttpResponse.json(playerInfo);
            }),
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-status`, () => {
                return HttpResponse.json(playerStatuses);
            })
        );
        renderPregame();

        await screen.findByText("my-game");
        act(() => emitToClient("pregame-lobby:3:start-game"));
        await waitFor(() => {
            expect(screen.getByTestId("game-nav")).toBeInTheDocument();
        });
    });

    it("enables Start Game only when all players are ready", async () => {
        server.use(
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-info`, () => {
                return HttpResponse.json(playerInfo);
            }),
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-status`, () => {
                return HttpResponse.json(playerStatuses);
            })
        );
        renderPregame();

        await screen.findByText("my-game");
        const startButton = screen.getByRole("button", { name: /start game/i });
        expect(startButton).toBeDisabled();

        const allReadyStatuses = [
            {
                id: 1,
                username: "hitoshi",
                user_chips: 500,
                Players: [{ host: true, ready: true }],
            },
            {
                id: 2,
                username: "hamada",
                user_chips: 500,
                Players: [{ host: false, ready: true }],
            },
        ];
        server.use(
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-status`, () => {
                return HttpResponse.json(allReadyStatuses);
            })
        );
        act(() => emitToClient("pregame-lobby:3:player-ready"));
        await waitFor(() => {
            expect(
                screen.getByRole("button", { name: /start game/i })
            ).toBeEnabled();
        });
    });

    it("dispatches toggleReady when Toggle Ready is clicked", async () => {
        let toggleCalls = 0;
        server.use(
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-info`, () => {
                return HttpResponse.json(playerInfo);
            }),
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-status`, () => {
                return HttpResponse.json(playerStatuses);
            }),
            http.post(`${serverAddress}/api/pregame-lobby/:gameId/toggle-ready`, () => {
                toggleCalls += 1;
                return HttpResponse.json({});
            })
        );
        const user = userEvent.setup();
        renderPregame();

        await screen.findByText("my-game");
        await user.click(screen.getByRole("button", { name: /toggle ready/i }));
        await waitFor(() => {
            expect(toggleCalls).toBe(1);
        });
    });

    it("dispatches leaveGame when Leave Game is clicked", async () => {
        let leaveCalls = 0;
        server.use(
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-info`, () => {
                return HttpResponse.json(playerInfo);
            }),
            http.get(`${serverAddress}/api/pregame-lobby/:gameId/player-status`, () => {
                return HttpResponse.json(playerStatuses);
            }),
            http.post(`${serverAddress}/api/pregame-lobby/:gameId/leave-game`, () => {
                leaveCalls += 1;
                return HttpResponse.json({});
            })
        );
        const user = userEvent.setup();
        renderPregame();

        await screen.findByText("my-game");
        await user.click(screen.getByRole("button", { name: /leave game/i }));
        await waitFor(() => {
            expect(leaveCalls).toBe(1);
        });
    });
});