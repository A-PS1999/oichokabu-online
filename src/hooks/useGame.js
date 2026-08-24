import { useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./useSocket";
import { fetchPlayerAuth, setGameState } from "../store/gameSlice";
import { GameAPI, PregameAPI } from "../services";

const JOIN_FAIL_MSG = "Failed to join game. Game has ended or " +
    "an error occurred. Redirecting...";

export function useGame({
    gameId,
    gamePhase,
    playerChips,
    isPickDealer,
    playerAuth
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
        socket.emit('game:rejoin', { gameId: location.state.game_id }, (res) => {
            if (res && !res.ok) {
                dispatch(toastActions.createToast({
                    message: JOIN_FAIL_MSG,
                    type: "error"
                }))
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

    useEffect(() => {
        const handleReloadGame = async () => {
            const { data: gameLobbyInfo } = await PregameAPI.getPlayerInfo(gameId);

            if (playerAuth && gameLobbyInfo.status === "running" && isPickDealer === null) {
                socket.emit('game:rejoin', { gameId }, (res) => {
                    if (res && !res.ok) {
                        dispatch(toastActions.createToast({
                            message: JOIN_FAIL_MSG,
                            type: "error"
                        }));
                        navigate("/lobby");
                    }
                })
            }
        }

        handleReloadGame();
    }, [dispatch, navigate, socket, gameId, isPickDealer, playerAuth]);
}