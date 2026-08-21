import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectGameId, selectIsDealerBool, postThirdCardChoice } from '../../../store/gameSlice';
import { modalActions } from '../../../store/modalSlice';
import './ThirdCardModal.scss';

export default function ThirdCardModal() {

    const dispatch = useDispatch();
    const gameId = useSelector(selectGameId);
    const isDealer = useSelector(selectIsDealerBool);

    const handleChoice = (event) => {
        const choiceMade = event.target.id;
        dispatch(postThirdCardChoice({ gameId, choiceMade, isDealer }));
        dispatch(modalActions.toggleModal());
    }

    return (
        <>
            <div className="cardmodal">
                <h2 className="cardmodal__heading">Would you like a third card?</h2>
                <div className="cardmodal__button-container">
                    <button className="cardmodal__button-container__yesbutton" id="yes" onClick={handleChoice}>
                        Yes please
                    </button>
                    <button className="cardmodal__button-container__nobutton" id="no" onClick={handleChoice}>
                        No thanks
                    </button>
                </div>
            </div>
        </>
    )
}