import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectPickDealerCards, selectPlayers, selectHasClicked, setHasClicked,
    selectCurrentPhase, selectPickDealerReveals, selectCurrentDealerData
} from '../../../store/gameSlice.js';
import Card from '../Card/Card.jsx';
import './PickDealerScreen.scss';

export default function PickDealerScreen() {

    const pickDealerCards = useSelector(selectPickDealerCards);
    const Players = useSelector(selectPlayers);
    const hasClicked = useSelector(selectHasClicked);
    const currentPhase = useSelector(selectCurrentPhase);
    const pickDealerReveals = useSelector(selectPickDealerReveals);
    const currentDealer = useSelector(selectCurrentDealerData);
    const dispatch = useDispatch();

    useEffect(() => {
        if (hasClicked && (pickDealerCards.length === Players.length)) {
            dispatch(setHasClicked(false));
        }
    }, [dispatch, pickDealerCards, Players, hasClicked])

    const isReveal = currentPhase === 'dealerReveal' && pickDealerReveals.length > 0;

    return (
        <div className="pickdealer-container">
            <div className='pickdealer-container__heading-group'>
                {isReveal ? (
                    <>
                        <h1>{currentDealer?.username} is the first dealer!</h1>
                        <ul className='pickdealer-container__reveal-list'>
                            {pickDealerReveals.map(reveal => {
                                const username = Players.find(player => player.id === reveal.userId)?.username;
                                return (
                                    <li key={reveal.userId} className='pickdealer-container__reveal-list__item'>
                                        {username} picked {reveal.cardVal}
                                    </li>
                                )
                            })}
                        </ul>
                    </>
                ) : (
                    <>
                        <h1>Click one face-down card to turn it over</h1>
                        <h2>The player who chooses the highest value card will be first dealer</h2>
                    </>
                )}
            </div>
            <div className='pickdealer-container__card-container'>
                {pickDealerCards.length > 0 ? pickDealerCards.map(card => {
                    return (
                        <Card
                            key={card.id}
                            src={card.src}
                            value={card.value}
                            id={card.id}
                            defaultHidden={true}
                            defaultDisabled={false}
                        />
                    )
                })
                    : <>
                        <h2 className='pickdealer-container__loading'>Loading...</h2>
                    </>
                }
            </div>
        </div>
    )
}