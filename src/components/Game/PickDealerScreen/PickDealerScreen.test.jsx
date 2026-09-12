import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderGame } from "../../../test-utils";
import PickDealerScreen from "./PickDealerScreen.jsx";

const pickDealerCards = [
    { id: 10, src: "/c1.jpg" },
    { id: 11, src: "/c2.jpg" },
];

const players = [
    { id: 1, username: "hitoshi" },
    { id: 2, username: "hamada" },
];

describe("PickDealerScreen", () => {
    it("renders the pick-dealer cards", () => {
        renderGame({
            preloadedState: {
                game: {
                    playerAuth: { id: 1, host: { host: false } },
                    Players: players,
                    pickDealerCards,
                    hasClicked: false,
                },
            },
            element: <PickDealerScreen />,
        });
        expect(screen.getByText(/Click one face-down card to turn it over/i)).toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: /front of an oicho kabu card/i })).toHaveLength(2);
    });

    it("renders the dealer reveal summary during dealerReveal", () => {
        renderGame({
            preloadedState: {
                game: {
                    playerAuth: { id: 1, host: { host: false } },
                    Players: players,
                    pickDealerCards,
                    pickDealerReveals: [
                        { userId: 1, cardId: 10, cardVal: 5 },
                        { userId: 2, cardId: 11, cardVal: 3 },
                    ],
                    currentPhase: "dealerReveal",
                    currentDealer: { id: 1, username: "hitoshi" },
                    hasClicked: false,
                },
            },
            element: <PickDealerScreen />,
        });
        expect(screen.getByText(/hitoshi is the first dealer/)).toBeInTheDocument();
        expect(screen.getByText(/hitoshi picked 5/)).toBeInTheDocument();
        expect(screen.getByText(/hamada picked 3/)).toBeInTheDocument();
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