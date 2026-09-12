import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../../mocks/server";
import { serverAddress } from "../../../settings";
import { renderGame } from "../../../test-utils";
import MakeBetForm from "./MakeBetForm";

describe("MakeBetForm", () => {
    it("dispatches postCardBet and closes the modal on submit", async () => {
        let betReceived: any;
        server.use(
            http.post(`${serverAddress}/api/game/:gameId/card-bet`, async ({ request }) => {
                const body = await request.json();
                betReceived = body;
                return HttpResponse.json({});
            })
        );
        const user = userEvent.setup();
        renderGame({
            preloadedState: {
                modal: { isOpen: true },
                game: {
                    playerAuth: { id: 1, host: { host: false, ready: false } },
                    gameId: "1",
                    currentlySelectedCard: { id: 1, ownerColumn: 0 },
                    betMax: 500,
                    totalBetAmount: 100,
                },
            },
            element: <MakeBetForm />,
        });

        expect(screen.getByText(/How much would you like to bet/i)).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: /submit bet/i }));

        await waitFor(() => {
            expect(betReceived).toBeTruthy();
        });
        expect(betReceived.betData.currentCard.id).toBe(1);
        expect(betReceived.betData.betAmount).toBe(100);
        expect(screen.queryByText(/How much would you like to bet/i)).not.toBeInTheDocument();
    });
});