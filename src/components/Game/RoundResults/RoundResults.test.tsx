import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderGame } from "../../../test-utils";
import type { RoundResult } from "@shared/game";
import RoundResults from "./RoundResults";

const lastRoundResult: RoundResult = {
    turn: 3,
    dealerId: 2,
    dealerUsername: "hamada",
    dealerHandValue: 5,
    dealerYaku: "arashi",
    busted: [],
    results: [
        { userId: 1, username: "hitoshi", betAmount: 100, handValue: 8, yaku: false, delta: 100 },
        { userId: 3, username: "matsumoto", betAmount: 200, handValue: 2, yaku: true, delta: -200 },
    ],
};

describe("RoundResults", () => {
    it("renders nothing when there is no lastRoundResult", () => {
        renderGame({
            preloadedState: {
                game: {
                    lastRoundResult: null,
                },
            },
            element: <RoundResults />,
        });
        expect(screen.queryByText(/Round .* Results/i)).not.toBeInTheDocument();
    });

    it("renders dealer info and per-player results with signed deltas", () => {
        renderGame({
            preloadedState: {
                game: {
                    lastRoundResult,
                },
            },
            element: <RoundResults />,
        });
        expect(screen.getByText(/Round 3 Results/)).toBeInTheDocument();
        expect(screen.getByText(/Dealer:/)).toHaveTextContent("hamada");
        expect(screen.getByText(/Hand value: 5/)).toBeInTheDocument();
        expect(screen.getByText("arashi")).toBeInTheDocument();
        expect(screen.getByText("hitoshi")).toBeInTheDocument();
        expect(screen.getByText(/Bet: 100/)).toBeInTheDocument();
        expect(screen.getByText(/Hand: 8/)).toBeInTheDocument();
        expect(screen.getByText("+100")).toBeInTheDocument();
        expect(screen.getByText("-200")).toBeInTheDocument();
        expect(screen.getByText("Yaku")).toBeInTheDocument();
    });

    it("renders busted players when lastRoundResult includes busted", () => {
        renderGame({
            preloadedState: {
                game: {
                    lastRoundResult: {
                        ...lastRoundResult,
                        busted: [
                            { userId: 3, username: "matsumoto", chips: 50 },
                        ],
                    },
                },
            },
            element: <RoundResults />,
        });
        expect(screen.getByText(/matsumoto busted/i)).toBeInTheDocument();
    });
});