import { useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useSocket } from "./useSocket";
import { fetchPlayerAuth, setGameState } from "../store/gameSlice";
import { createToast } from "../store/toastSlice";

const JOIN_FAIL_MSG = "Failed to join game. Game has ended or " +
    "an error occurred. Redirecting...";
const BUST_MSG = "You busted — returning to the lobby.";

export function useGame({
    gameId,
    gamePhase,
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = useSocket();
    const exitFired = useRef(false);

    const handleUpdateGameState = useCallback((data) => {
        dispatch(setGameState(data));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchPlayerAuth(gameId));
        socket.emit('game:rejoin', { gameId }, (res) => {
            if (res && !res.ok) {
                dispatch(createToast({
                    message: JOIN_FAIL_MSG,
                    type: "error"
                }));
                navigate('/lobby');
            }
        });

        socket.on(`game:${gameId}:update-game`, handleUpdateGameState)

        return () => {
            socket.off(`game:${gameId}:update-game`);
        }
    }, [dispatch, socket, gameId, handleUpdateGameState]);

    useEffect(() => {
        const exitGame = () => {
            if (exitFired.current) return;
            exitFired.current = true;
            navigate("/lobby");
        };
        const exitGameBusted = () => {
            if (exitFired.current) return;
            exitFired.current = true;
            dispatch(createToast({
                message: BUST_MSG,
                type: "error"
            }));
            navigate("/lobby");
        };

        socket.on(`game:${gameId}:end-game`, exitGame);
        socket.on(`game:${gameId}:player-busted`, exitGameBusted);

        if (gamePhase === "endGame") {
            exitGame();
        }

        return () => {
            socket.off(`game:${gameId}:end-game`, exitGame);
            socket.off(`game:${gameId}:player-busted`, exitGameBusted);
        }
    }, [dispatch, navigate, socket, gameId, gamePhase]);
};
