import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { useSelector } from "react-redux";
import { renderGame } from "../../../test-utils";
import { modalSelector } from "../../../store/modalSlice";
import CardsValueCounter from "./CardsValueCounter";

function ModalProbe() {
    const { isOpen } = useSelector(modalSelector);
    return <div data-testid="modal-open">{isOpen ? "open" : "closed"}</div>;
}

describe("CardsValueCounter", () => {
    it("displays the cards value", () => {
        renderGame({
            preloadedState: {
                game: {
                    playerAuth: { id: 1, host: { host: false, ready: false } },
                    currentDealer: { id: 2, username: "hamada", chips: 500, cardBet: [], isDealer: true, thirdCardChosen: null, seat: 1 },
                    cardBets: [],
                    Players: [{ id: 1, username: "hitoshi", chips: 500, isDealer: false, thirdCardChosen: null }],
                    currentPhase: "scoringPhase",
                },
            },
            element: (
                <CardsValueCounter
                    cards={[{ value: 7 }, { value: 5 }]}
                    parentColumn={0}
                />
            ),
        });
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("keeps counting through roundResults", () => {
        renderGame({
            preloadedState: {
                game: {
                    playerAuth: { id: 1, host: { host: false, ready: false } },
                    currentDealer: { id: 2, username: "hamada", chips: 500, cardBet: [], isDealer: true, thirdCardChosen: null, seat: 1 },
                    cardBets: [],
                    Players: [{ id: 1, username: "hitoshi", chips: 500, isDealer: false, thirdCardChosen: null }],
                    currentPhase: "roundResults",
                },
            },
            element: (
                <CardsValueCounter
                    cards={[{ value: 7 }, { value: 5 }]}
                    parentColumn={0}
                />
            ),
        });
        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("opens the modal for a player's column when value is 4-6 with no third card", async () => {
        renderGame({
            preloadedState: {
                modal: { isOpen: false },
                game: {
                    playerAuth: { id: 1, host: { host: false, ready: false } },
                    currentDealer: { id: 2, username: "hamada", chips: 500, cardBet: [], isDealer: true, thirdCardChosen: null, seat: 1 },
                    cardBets: [{ userId: 1, cardId: 1, ownerColumn: 0, betAmount: 100, value: 5 }],
                    Players: [
                        { id: 1, username: "hitoshi", chips: 500, isDealer: false, thirdCardChosen: null },
                    ],
                    currentPhase: "scoringPhase",
                },
            },
            element: (
                <>
                    <CardsValueCounter
                        cards={[{ value: 4 }, { value: 2 }]}
                        parentColumn={0}
                    />
                    <ModalProbe />
                </>
            ),
        });

        expect(screen.getByText("6")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByTestId("modal-open")).toHaveTextContent("open");
        });
    });

    it("does not open the modal when the value is outside 4-6", async () => {
        renderGame({
            preloadedState: {
                modal: { isOpen: false },
                game: {
                    playerAuth: { id: 1, host: { host: false, ready: false } },
                    currentDealer: { id: 2, username: "hamada", chips: 500, cardBet: [], isDealer: true, thirdCardChosen: null, seat: 1 },
                    cardBets: [{ userId: 1, cardId: 1, ownerColumn: 0, betAmount: 100, value: 5 }],
                    Players: [
                        { id: 1, username: "hitoshi", chips: 500, isDealer: false, thirdCardChosen: null },
                    ],
                    currentPhase: "scoringPhase",
                },
            },
            element: (
                <>
                    <CardsValueCounter
                        cards={[{ value: 9 }, { value: 2 }]}
                        parentColumn={0}
                    />
                    <ModalProbe />
                </>
            ),
        });

        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByTestId("modal-open")).toHaveTextContent("closed");
    });
});