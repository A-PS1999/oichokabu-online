import { describe, it, expect } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../../mocks/server";
import { serverAddress } from "../../../settings";
import { renderGame } from "../../../test-utils";
import { emitToClient } from "../../../mocks/socketMock";
import Card from "./Card.jsx";

function renderCard(cardProps, gameOverrides = {}) {
    return renderGame({
        preloadedState: {
            game: {
                playerAuth: { id: 1, host: { host: false } },
                currentPlayer: { id: 1, username: "hitoshi" },
                currentDealer: null,
                currentPhase: null,
                gameId: "1",
                isPickDealer: null,
                hasClicked: false,
                ...gameOverrides,
            },
        },
        element: (
            <Card
                id={1}
                value={7}
                src="/cards/card.jpg"
                ownerColumn={0}
                defaultHidden={false}
                defaultDisabled={false}
                {...cardProps}
            />
        ),
    });
}

describe("Card", () => {
    it("renders the card value when not hidden", () => {
        renderCard();
        expect(screen.getByText("7")).toBeInTheDocument();
    });

    it("hides the value when defaultHidden is true", () => {
        renderCard({ defaultHidden: true });
        expect(screen.queryByText("7")).not.toBeInTheDocument();
    });

    it("reveals the server-resolved value and disables a card on matching pickdealer-card-selected", () => {
        renderCard({ defaultHidden: true, value: undefined });
        act(() =>
            emitToClient("game:1:pickdealer-card-selected", { cardId: 1, userId: 2, cardVal: 9 })
        );
        expect(screen.getByText("9")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /front of an oicho kabu card/i })).toBeDisabled();
    });

    it("disables own card on matching card-bet-made", () => {
        renderCard();
        act(() => emitToClient("game:1:card-bet-made", { userId: 1, cardId: 1 }));
        expect(screen.getByRole("button", { name: /front of an oicho kabu card/i })).toBeDisabled();
    });

    it("does not disable other players' card on card-bet-made", () => {
        renderCard();
        act(() => emitToClient("game:1:card-bet-made", { userId: 2, cardId: 1 }));
        expect(screen.getByRole("button", { name: /front of an oicho kabu card/i })).not.toBeDisabled();
    });

    it("dispatches postDealerCardSelected without cardVal when clicked in pick-dealer mode", async () => {
        let postCalls = 0;
        let requestBody;
        server.use(
            http.post(`${serverAddress}/api/game/:gameId/pickdealer-card-selected`, async ({ request }) => {
                postCalls += 1;
                requestBody = await request.json();
                return HttpResponse.json({});
            })
        );
        const user = userEvent.setup();
        renderCard({}, { isPickDealer: true, hasClicked: false });
        await user.click(screen.getByRole("button", { name: /front of an oicho kabu card/i }));
        await waitFor(() => {
            expect(postCalls).toBe(1);
        });
        expect(requestBody.cardId).toBe(1);
        expect(requestBody.cardVal).toBeUndefined();
    });

    it("reveals the card in scoringPhase", () => {
        renderCard({ defaultHidden: true }, { currentPhase: "scoringPhase" });
        expect(screen.getByText("7")).toBeInTheDocument();
    });
});