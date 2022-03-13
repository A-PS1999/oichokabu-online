import React, { useEffect, useState } from 'react';
import { socket } from '../../../services';
import { useDispatch, useSelector } from 'react-redux';
import { setCardSelection, setHasClicked, gameSelector, incrementTotalBetAmount } from '../../../store/gameSlice';
import { modalActions } from '../../../store/modalSlice';
import { GameAPI } from '../../../services';
import './Card.scss';

const handlePickDealerCardSelection = (gameId, cardId, cardVal) => {
    GameAPI.postDealerCardSelected(gameId, cardId, cardVal)
}

export default function Card({id, game_id, value, src, defaultVisibility}) {

    const [cardValue, setCardValue] = useState(null);
    const [isHidden, setIsHidden] = useState(defaultVisibility);
    const [isDisabled, setIsDisabled] = useState(false);
    const { playerId, hasClicked, isPickDealer } = useSelector(gameSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        setCardValue(value);
    }, [value])

    useEffect(() => {
        const dealerDecideClickHandler = (data) => {
            if (data.cardId === id) {
                setIsHidden(false);
                setIsDisabled(true);
                dispatch(setCardSelection( data ));
            }
            if (playerId && data.userId === playerId) {
                dispatch(setHasClicked())
            }
        }
        socket.on(`game:${game_id}:pickdealer-card-selected`, dealerDecideClickHandler)
        return () => {
            socket.off(`game:${game_id}:pickdealer-card-selected`, dealerDecideClickHandler);
        }
    }, [dispatch, game_id, playerId, id])

    useEffect(() => {
        const cardBetSocketHandler = (data) => {
            dispatch(incrementTotalBetAmount(data.betAmount));
            // add more card bet dispatch stuff here
        }
        socket.on(`game:${game_id}:card-bet-made`, cardBetSocketHandler);
        return () => {
            socket.off(`game:${game_id}:card-bet-made`, cardBetSocketHandler)
        }
    }, [dispatch, game_id])

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
                <button className='game-card__button' disabled={isDisabled || hasClicked} 
                    onClick={() => { isPickDealer ? handlePickDealerCardSelection(game_id, id, cardValue) : dispatch(modalActions.toggleModal()) }}>
                    <img src={isHidden ? "/cards/cardback.jpg" : src} alt="Oicho Kabu card" id={id} />
                </button>
            </div>
        </>
    )
}
