import { useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./useSocket";
import { fetchPlayerAuth, setGameState } from "../store/gameSlice";
import { createToast } from "../store/toastSlice";
import { GameAPI } from "../services";

const JOIN_FAIL_MSG = "Failed to join game. Game has ended or " +
    "an error occurred. Redirecting...";

export function useGame({
    gameId,
    gamePhase,
    playerChips,
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = useSocket();
    const endBustFired = useRef(false);

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
        const endBustHandler = () => {
            if (endBustFired.current) return;
            endBustFired.current = true;
            GameAPI.postUpdateChips(playerChips);
            navigate("/lobby");
            GameAPI.postRemovePlayer(gameId);
        };

        if ((gamePhase === "checkForBustPlayers" && playerChips < 100) ||
            gamePhase === "endGame") {
            endBustHandler();
        }

        socket.on(`game:${gameId}:end-game`, endBustHandler);

        return () => {
            socket.off(`game:${gameId}:end-game`, endBustHandler);
        }
    }, [navigate, socket, gameId, gamePhase, playerChips]);
};