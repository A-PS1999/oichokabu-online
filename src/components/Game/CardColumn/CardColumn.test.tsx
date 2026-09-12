import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderGame } from "../../../test-utils";
import type { CardColumn as CardColumnType } from "@shared/game";
import CardColumn from "./CardColumn";

const column: CardColumnType = {
    columnId: 0,
    cards: [
        { id: 1, value: 7, src: "/c1.jpg" },
        { id: 2, value: 5, src: "/c2.jpg" },
        { id: 3, value: 3, src: "/c3.jpg" },
    ],
};

describe("CardColumn", () => {
    it("renders all three cards and the value counter", () => {
        renderGame({
            preloadedState: {
                game: {
                    playerAuth: { id: 1, host: { host: false, ready: false } },
                    currentDealer: { id: 2, username: "hamada", chips: 500, cardBet: [], isDealer: true, thirdCardChosen: null, seat: 1 },
                    cardBets: [],
                },
            },
            element: <CardColumn column={column} columnIndex={0} />,
        });
        expect(screen.getAllByRole("button", { name: /front of an oicho kabu card/i })).toHaveLength(3);
        expect(screen.getByText("7")).toBeInTheDocument();
    });
});