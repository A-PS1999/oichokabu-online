import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderGame } from "../../../test-utils";
import PickDealerScreen from "./PickDealerScreen.jsx";

const pickDealerCards = [
    { id: 10, src: "/c1.jpg", value: 5 },
    { id: 11, src: "/c2.jpg", value: 3 },
];

describe("PickDealerScreen", () => {
    it("renders the pick-dealer cards", () => {
        renderGame({
            preloadedState: {
                game: {
                    playerAuth: { id: 1, host: { host: false } },
                    Players: [{ id: 1 }, { id: 2 }],
                    pickDealerCards,
                    hasClicked: false,
                },
            },
            element: <PickDealerScreen />,
        });
        expect(screen.getByText(/Click one face-down card to turn it over/i)).toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: /front of an oicho kabu card/i })).toHaveLength(2);
    });

    it("shows Loading when there are no pick-dealer cards", () => {
        renderGame({
            preloadedState: {
                game: {
                    playerAuth: { id: 1, host: { host: false } },
                    Players: [],
                    pickDealerCards: [],
                    hasClicked: false,
                },
            },
            element: <PickDealerScreen />,
        });
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
});