import React, { useEffect, useState } from 'react';
import { socket } from '../../../services';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSelection, setHasClicked, gameSelector } from '../../../store/gameSlice';
import { modalActions } from '../../../store/modalSlice';
import { GameAPI } from '../../../services';
import './Card.scss';

const handlePickDealerCardSelection = (gameId, cardId, cardVal) => {
    GameAPI.postDealerCardSelected(gameId, cardId, cardVal)
}

export default function Card({id, value, src, ownerColumn, defaultHidden, defaultDisabled}) {

    const [cardValue, setCardValue] = useState(null);
    const [isHidden, setIsHidden] = useState(defaultHidden);
    const [isDisabled, setIsDisabled] = useState(defaultDisabled);
    const { playerAuth, hasClicked, isPickDealer, currentDealer, currentPlayer, currentPhase, gameId } = useSelector(gameSelector);
    const dispatch = useDispatch();

    const handleMainGameCardClick = () => {
        dispatch(modalActions.toggleModal());
        dispatch(setCurrentSelection({ id, ownerColumn }))
    }

    useEffect(() => {
        setCardValue(value);
    }, [value])

    useEffect(() => {
        if (currentPhase === 'scoringPhase') {
            setIsHidden(false);
        }
    }, [currentPhase]);

    useEffect(() => {
        if (currentPhase === 'prepareNextRound' && hasClicked === true) {
            dispatch(setHasClicked(false));
        }
        if (currentPhase === 'prepareNextRound') {
            setIsDisabled(false);
        }
    }, [dispatch, currentPhase, hasClicked])

    const determineDisabled = () => {
        if (isDisabled || hasClicked || (currentDealer && playerAuth.id === currentDealer.id)) {
            return true
        } else if (!isPickDealer && (currentPlayer && currentPlayer.id !== playerAuth.id)) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        const dealerDecideClickHandler = (data) => {
            if (data.cardId === id) {
                setIsHidden(false);
                setIsDisabled(true);
            }
            if (playerAuth.id && data.userId === playerAuth.id) {
                dispatch(setHasClicked(true));
            }
        }
        socket.on(`game:${gameId}:pickdealer-card-selected`, dealerDecideClickHandler)
        return () => {
            socket.off(`game:${gameId}:pickdealer-card-selected`, dealerDecideClickHandler);
        }
    }, [dispatch, gameId, playerAuth, id])

    useEffect(() => {
        const cardBetSocketHandler = (data) => {
            if (data.userId === playerAuth.id && data.cardId === id) {
                setIsDisabled(true);
            }
            if (playerAuth.id && playerAuth.id === data.userId) {
                dispatch(setHasClicked(true));
            }
        }
        socket.on(`game:${gameId}:card-bet-made`, cardBetSocketHandler);
        return () => {
            socket.off(`game:${gameId}:card-bet-made`, cardBetSocketHandler)
        }
    }, [dispatch, gameId, playerAuth, id, value])

    return (
        <>
            <div className="game-card">
                { isHidden ? null : 
                    <div className='game-card__value-container'>
                        <div className="game-card__value-container__value">
                            {cardValue}
                        </div>
                    </div> 
                }
                <button className='game-card__button' disabled={determineDisabled()} 
                    onClick={() => { isPickDealer ? handlePickDealerCardSelection(gameId, id, cardValue) : handleMainGameCardClick() }}>
                    <div className={isHidden ? "game-card__inner--hidden" : "game-card__inner"}>
                        <div className="game-card__side game-card__side--front">
                            <img src={src} alt="Front of an Oicho Kabu card" id={id} />
                        </div>
                        <div className="game-card__side game-card__side">
                            <img src="/cards/cardback.jpg" alt="Back of an Oicho Kabu card" />
                        </div>
                    </div>
                </button>
            </div>
        </>
    )
}
