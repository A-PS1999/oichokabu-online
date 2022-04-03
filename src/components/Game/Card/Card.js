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

export default function Card({id, value, src, defaultHidden, defaultDisabled}) {

    const [cardValue, setCardValue] = useState(null);
    const [isHidden, setIsHidden] = useState(defaultHidden);
    const [isDisabled, setIsDisabled] = useState(defaultDisabled);
    const { playerAuth, hasClicked, isPickDealer, currentDealer, gameId } = useSelector(gameSelector);
    const dispatch = useDispatch();

    const handleMainGameCardClick = () => {
        dispatch(modalActions.toggleModal());
        dispatch(setCurrentSelection(id))
    }

    useEffect(() => {
        setCardValue(value);
    }, [value])

    useEffect(() => {
        const dealerDecideClickHandler = (data) => {
            if (data.cardId === id) {
                setIsHidden(false);
                setIsDisabled(true);
            }
            if (playerAuth.id && data.userId === playerAuth.id) {
                dispatch(setHasClicked())
            }
        }
        socket.on(`game:${gameId}:pickdealer-card-selected`, dealerDecideClickHandler)
        return () => {
            socket.off(`game:${gameId}:pickdealer-card-selected`, dealerDecideClickHandler);
        }
    }, [dispatch, gameId, playerAuth, id])

    useEffect(() => {
        const cardBetSocketHandler = (data) => {
            if (data.betAmount.user_id === playerAuth.id && data.betAmount.card_id === id) {
                setIsDisabled(true);
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
                <button className='game-card__button' disabled={isDisabled || hasClicked || (currentDealer && playerAuth.id === currentDealer.id)} 
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
