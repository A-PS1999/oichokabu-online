import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gameSelector, setHasClicked } from '../../../store/gameSlice.js';
import Card from '../Card/Card.js';
import './PickDealerScreen.scss';

export default function PickDealerScreen() {

    const { pickDealerCards, Players, hasClicked } = useSelector(gameSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (hasClicked && (pickDealerCards.length === Players.length)) {
            dispatch(setHasClicked(false));
        }
    }, [dispatch, pickDealerCards, Players, hasClicked])

    return (
        <div className="pickdealer-container">
            <div className='pickdealer-container__heading-group'>
                <h1>Click one face-down card to turn it over</h1>
                <h2>The player who chooses the highest value card will be first dealer</h2>
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