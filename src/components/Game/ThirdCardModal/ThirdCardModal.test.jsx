import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../../mocks/server";
import { serverAddress } from "../../../settings";
import { renderGame } from "../../../test-utils";
import ThirdCardModal from "./ThirdCardModal.jsx";

describe("ThirdCardModal", () => {
    it("dispatches postThirdCardChoice and closes the modal on Yes", async () => {
        let received;
        server.use(
            http.post(`${serverAddress}/api/game/:gameId/decide-third-card`, async ({ request }) => {
                const body = await request.json();
                received = body;
                return HttpResponse.json({});
            })
        );
        const user = userEvent.setup();
        renderGame({
            preloadedState: {
                modal: { isOpen: true },
                game: {
                    playerAuth: { id: 1, host: { host: false } },
                    currentDealer: { id: 2, username: "hamada" },
                    gameId: "1",
                },
            },
            element: <ThirdCardModal />,
        });

        expect(screen.getByText(/Would you like a third card/i)).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: /yes please/i }));

        await waitFor(() => {
            expect(received).toBeTruthy();
        });
        expect(received.choiceMade).toBe("yes");
        expect(received.isDealer).toBe(false);
        expect(screen.queryByText(/Would you like a third card/i)).not.toBeInTheDocument();
    });

    it("dispatches postThirdCardChoice with isDealer true for the dealer", async () => {
        let received;
        server.use(
            http.post(`${serverAddress}/api/game/:gameId/decide-third-card`, async ({ request }) => {
                const body = await request.json();
                received = body;
                return HttpResponse.json({});
            })
        );
        const user = userEvent.setup();
        renderGame({
            preloadedState: {
                modal: { isOpen: true },
                game: {
                    playerAuth: { id: 2, host: { host: false } },
                    currentDealer: { id: 2, username: "hamada" },
                    gameId: "1",
                },
            },
            element: <ThirdCardModal />,
        });

        await user.click(screen.getByRole("button", { name: /no thanks/i }));
        await waitFor(() => {
            expect(received).toBeTruthy();
        });
        expect(received.choiceMade).toBe("no");
        expect(received.isDealer).toBe(true);
    });
});