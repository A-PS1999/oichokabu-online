import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { gameSelector, selectIsDealerBool } from '../../../store/gameSlice';
import { GameAPI } from '../../../services';
import { modalActions } from '../../../store/modalSlice';
import './ThirdCardModal.scss';

export default function ThirdCardModal() {

    const dispatch = useDispatch();
    const { gameId } = useSelector(gameSelector);
    const isDealer = useSelector(selectIsDealerBool);

    const handleChoice = (event, isDealer) => {
        const choiceMade = event.target.id;
        GameAPI.postThirdCardChoice(gameId, choiceMade, isDealer);
        dispatch(modalActions.toggleModal());
    }

    return (
        <>
            <div className="cardmodal">
                <h2 className="cardmodal__heading">Would you like a third card?</h2>
                <div className="cardmodal__button-container">
                    <button className="cardmodal__button-container__yesbutton" id="yes" onClick={(event) => handleChoice(event, isDealer)}>
                        Yes please
                    </button>
                    <button className="cardmodal__button-container__nobutton" id="no" onClick={(event) => handleChoice(event, isDealer)}>
                        No thanks
                    </button>
                </div>
            </div>
        </>
    )
}