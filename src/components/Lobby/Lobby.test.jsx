import { describe, it, expect } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/server";
import { serverAddress } from "../../settings";
import { renderWithProviders } from "../../test-utils";
import { emitToClient } from "../../mocks/socketMock";
import { useParams } from "react-router";
import Lobby from "./Lobby";

const rooms = [
    {
        game_id: 1,
        room_name: "open-room",
        status: "open",
        Players: [{ id: 1 }, { id: 2 }],
        player_cap: 2,
        turn_max: 12,
        bet_max: 500,
    },
    {
        game_id: 2,
        room_name: "room-with-space",
        status: "open",
        Players: [{ id: 1 }],
        player_cap: 4,
        turn_max: 12,
        bet_max: 500,
    },
];

function preloadedLobby({ userId, chips, roomsList = [] }) {
    return {
        lobby: {
            userId,
            chips,
            rooms: roomsList,
            isFetching: false,
            isSuccessful: false,
            isError: false,
            errorMessage: "",
        },
    };
}

function LobbyRoutes({ onNavigate }) {
    const { gameId } = useParams();
    return (
        <div data-testid="nav">
            {gameId}
            {onNavigate ? <button onClick={() => onNavigate(gameId)}>record</button> : null}
        </div>
    );
}

describe("Lobby", () => {
    it("renders rooms from fetchGames and shows chips", async () => {
        server.use(
            http.get(`${serverAddress}/api/lobby/lobbies`, () => {
                return HttpResponse.json(rooms);
            }),
            http.get(`${serverAddress}/api/get-user-id`, () => {
                return HttpResponse.json({ id: 5 });
            }),
            http.get(`${serverAddress}/api/lobby/user-chips`, () => {
                return HttpResponse.json(500);
            })
        );
        renderWithProviders(<Lobby />, {
            initialEntries: ["/lobby"],
            routes: [
                { path: "/lobby", element: <Lobby /> },
                { path: "/pregame-lobby/:gameId", element: <LobbyRoutes /> },
            ],
            preloadedState: preloadedLobby({ userId: 5, chips: 500 }),
        });

        await waitFor(() => {
            expect(screen.getByText(/open-room/)).toBeInTheDocument();
        });
        expect(screen.getByText(/room-with-space/)).toBeInTheDocument();
        expect(screen.getByText(/Your Chips: 500/)).toBeInTheDocument();
        expect(screen.getByText(/2\/2/)).toBeInTheDocument();
        expect(screen.getByText(/1\/4/)).toBeInTheDocument();
    });

    it("disables Join when room is full or chips < 100", async () => {
        server.use(
            http.get(`${serverAddress}/api/lobby/lobbies`, () => {
                return HttpResponse.json(rooms);
            }),
            http.get(`${serverAddress}/api/get-user-id`, () => {
                return HttpResponse.json({ id: 5 });
            }),
            http.get(`${serverAddress}/api/lobby/user-chips`, () => {
                return HttpResponse.json(50);
            })
        );
        renderWithProviders(<Lobby />, {
            initialEntries: ["/lobby"],
            routes: [
                { path: "/lobby", element: <Lobby /> },
                { path: "/pregame-lobby/:gameId", element: <LobbyRoutes /> },
            ],
            preloadedState: preloadedLobby({ userId: 5, chips: 50 }),
        });

        await waitFor(() => {
            expect(screen.getByText(/open-room/)).toBeInTheDocument();
        });
        const joinButtons = screen.getAllByRole("button", { name: /join game/i });
        expect(joinButtons).toHaveLength(2);
        expect(joinButtons[0]).toBeDisabled();
        expect(joinButtons[1]).toBeDisabled();
    });

    it("navigates to pregame-lobby on lobby:create-game when userId matches", async () => {
        server.use(
            http.get(`${serverAddress}/api/lobby/lobbies`, () => {
                return HttpResponse.json([]);
            }),
            http.get(`${serverAddress}/api/get-user-id`, () => {
                return HttpResponse.json({ id: 5 });
            }),
            http.get(`${serverAddress}/api/lobby/user-chips`, () => {
                return HttpResponse.json(500);
            })
        );
        renderWithProviders(<Lobby />, {
            initialEntries: ["/lobby"],
            routes: [
                { path: "/lobby", element: <Lobby /> },
                { path: "/pregame-lobby/:gameId", element: <LobbyRoutes /> },
            ],
            preloadedState: preloadedLobby({ userId: 5, chips: 500 }),
        });

        await waitFor(() => {
            expect(screen.getByText(/Your Chips: 500/)).toBeInTheDocument();
        });
        act(() => emitToClient("lobby:create-game", { gameId: 7, userId: 5 }));
        await waitFor(() => {
            expect(screen.getByTestId("nav")).toHaveTextContent("7");
        });
    });

    it("does not navigate on lobby:create-game when userId does not match", async () => {
        server.use(
            http.get(`${serverAddress}/api/lobby/lobbies`, () => {
                return HttpResponse.json([]);
            }),
            http.get(`${serverAddress}/api/get-user-id`, () => {
                return HttpResponse.json({ id: 5 });
            }),
            http.get(`${serverAddress}/api/lobby/user-chips`, () => {
                return HttpResponse.json(500);
            })
        );
        renderWithProviders(<Lobby />, {
            initialEntries: ["/lobby"],
            routes: [
                { path: "/lobby", element: <Lobby /> },
                { path: "/pregame-lobby/:gameId", element: <LobbyRoutes /> },
            ],
            preloadedState: preloadedLobby({ userId: 5, chips: 500 }),
        });

        await waitFor(() => {
            expect(screen.getByText(/Your Chips: 500/)).toBeInTheDocument();
        });
        act(() => emitToClient("lobby:create-game", { gameId: 7, userId: 999 }));
        expect(screen.queryByTestId("nav")).not.toBeInTheDocument();
    });

    it("navigates to pregame-lobby on lobby:join-game when userId matches", async () => {
        server.use(
            http.get(`${serverAddress}/api/lobby/lobbies`, () => {
                return HttpResponse.json([]);
            }),
            http.get(`${serverAddress}/api/get-user-id`, () => {
                return HttpResponse.json({ id: 5 });
            }),
            http.get(`${serverAddress}/api/lobby/user-chips`, () => {
                return HttpResponse.json(500);
            })
        );
        renderWithProviders(<Lobby />, {
            initialEntries: ["/lobby"],
            routes: [
                { path: "/lobby", element: <Lobby /> },
                { path: "/pregame-lobby/:gameId", element: <LobbyRoutes /> },
            ],
            preloadedState: preloadedLobby({ userId: 5, chips: 500 }),
        });

        await waitFor(() => {
            expect(screen.getByText(/Your Chips: 500/)).toBeInTheDocument();
        });
        act(() => emitToClient("lobby:join-game", { gameId: 9, userId: 5 }));
        await waitFor(() => {
            expect(screen.getByTestId("nav")).toHaveTextContent("9");
        });
    });

    it("resets chips when Reset Chips is clicked", async () => {
        server.use(
            http.get(`${serverAddress}/api/lobby/lobbies`, () => {
                return HttpResponse.json([]);
            }),
            http.post(`${serverAddress}/api/lobby/reset-chips`, async ({ request }) => {
                const body = await request.json();
                return HttpResponse.json(body.chips);
            }),
            http.get(`${serverAddress}/api/get-user-id`, () => {
                return HttpResponse.json({ id: 5 });
            }),
            http.get(`${serverAddress}/api/lobby/user-chips`, () => {
                return HttpResponse.json(10000);
            })
        );
        renderWithProviders(<Lobby />, {
            initialEntries: ["/lobby"],
            routes: [
                { path: "/lobby", element: <Lobby /> },
                { path: "/pregame-lobby/:gameId", element: <LobbyRoutes /> },
            ],
            preloadedState: preloadedLobby({ userId: 5, chips: 5000 }),
        });

        await waitFor(() => {
            expect(screen.getByText(/Your Chips: 5000/)).toBeInTheDocument();
        });
        await userEvent.click(screen.getByRole("button", { name: /reset chips/i }));
        await waitFor(() => {
            expect(screen.getByText(/Your Chips: 10000/)).toBeInTheDocument();
        });
    });
});