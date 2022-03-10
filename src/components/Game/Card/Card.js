import React, { useEffect, useState } from 'react';
import { socket } from '../../../services';
import { useDispatch, useSelector } from 'react-redux';
import { setCardSelection, setHasClicked, gameSelector } from '../../../store/gameSlice';
import './Card.scss';

export default function Card({id, game_id, value, src, defaultVisibility, func}) {

    const [cardValue, setCardValue] = useState(null);
    const [isHidden, setIsHidden] = useState(defaultVisibility);
    const [isDisabled, setIsDisabled] = useState(false);
    const { playerId, hasClicked } = useSelector(gameSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        setCardValue(value);
    }, [value])

    useEffect(() => {
        socket.on(`game:${game_id}:pickdealer-card-selected`, (data) => {
            if (data.cardId === id) {
                setIsHidden(false);
                setIsDisabled(true);
                dispatch(setCardSelection( data ));
            }
            if (playerId && data.userId === playerId) {
                dispatch(setHasClicked())
            }
        })
        return () => {
            socket.off(`game:${game_id}:pickdealer-card-selected`);
        }
    }, [dispatch, game_id, playerId, id])

    return (
        <>
            <button className='card-button' disabled={isDisabled || hasClicked}  onClick={() => func(game_id, id, cardValue)}>
                <img src={isHidden ? "/cards/cardback.jpg" : src} alt="Oicho Kabu card" id={id} />
            </button>
        </>
    )
}