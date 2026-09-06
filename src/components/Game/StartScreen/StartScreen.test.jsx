import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StartScreen from "./StartScreen.jsx";

describe("StartScreen", () => {
    it("renders Start Game button when the player is host", () => {
        render(<StartScreen playerAuth={{ host: { host: true } }} onStart={() => {}} />);
        expect(screen.getByRole("button", { name: /start game/i })).toBeInTheDocument();
    });

    it("calls onStart when Start Game is clicked", async () => {
        const onStart = vi.fn();
        const user = userEvent.setup();
        render(<StartScreen playerAuth={{ host: { host: true } }} onStart={onStart} />);
        await user.click(screen.getByRole("button", { name: /start game/i }));
        expect(onStart).toHaveBeenCalled();
    });

    it("renders waiting text when the player is not host", () => {
        render(<StartScreen playerAuth={{ host: { host: false } }} onStart={() => {}} />);
        expect(screen.getByText(/Waiting for the host to start the game/i)).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /start game/i })).not.toBeInTheDocument();
    });
});