import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../../mocks/server";
import { serverAddress } from "../../../settings";
import { renderWithProviders } from "../../../test-utils";
import CreateGameForm from "./CreateGameForm";

function renderCreateGameForm() {
    return renderWithProviders(<CreateGameForm />, {
        initialEntries: ["/lobby"],
        routes: [{ path: "/lobby", element: <CreateGameForm /> }],
        preloadedState: {
            modal: { isOpen: true },
            lobby: {
                userId: 5,
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

describe("CreateGameForm", () => {
    it("renders the create-game form when the modal is open", () => {
        renderCreateGameForm();
        expect(
            screen.getByRole("heading", { name: /create a new game/i })
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/room name/i)).toBeInTheDocument();
    });

    it("dispatches createNewGame on submit with a valid room name", async () => {
        let received;
        server.use(
            http.post(`${serverAddress}/api/lobby/create-game`, async ({ request }) => {
                received = await request.json();
                return HttpResponse.json({
                    game_id: 11,
                    room_name: received.roomName,
                    status: "open",
                    Players: [],
                    player_cap: Number(received.playerCap),
                    turn_max: Number(received.turnMax),
                    bet_max: Number(received.betMax),
                });
            })
        );
        const user = userEvent.setup();
        renderCreateGameForm();

        await user.type(screen.getByPlaceholderText(/room name/i), "my-room");
        await user.click(screen.getByRole("button", { name: /^create game$/i }));

        await waitFor(() => {
            expect(received).toBeTruthy();
        });
        expect(received.roomName).toBe("my-room");
        expect(received.playerCap).toBe("2");
        expect(received.turnMax).toBe(12);
        expect(received.betMax).toBe(500);
    });

    it("shows an error toast when createNewGame rejects", async () => {
        server.use(
            http.post(`${serverAddress}/api/lobby/create-game`, () => {
                return HttpResponse.json(
                    { message: "could not create game" },
                    { status: 500 }
                );
            })
        );
        const user = userEvent.setup();
        renderCreateGameForm();

        await user.type(screen.getByPlaceholderText(/room name/i), "my-room");
        await user.click(screen.getByRole("button", { name: /^create game$/i }));

        await waitFor(() => {
            expect(document.querySelector(".toast")).toBeInTheDocument();
        });
    });

    it("does not dispatch createNewGame for a room name shorter than 3 characters", async () => {
        let createCalls = 0;
        server.use(
            http.post(`${serverAddress}/api/lobby/create-game`, () => {
                createCalls += 1;
                return HttpResponse.json({});
            })
        );
        const user = userEvent.setup();
        renderCreateGameForm();

        await user.type(screen.getByPlaceholderText(/room name/i), "ab");
        await user.click(screen.getByRole("button", { name: /^create game$/i }));

        await waitFor(() => {
            expect(document.querySelector(".toast")).not.toBeInTheDocument();
        });
        expect(createCalls).toBe(0);
    });
});