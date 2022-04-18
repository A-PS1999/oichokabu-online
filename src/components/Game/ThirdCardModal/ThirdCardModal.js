import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { gameSelector } from '../../../store/gameSlice';
import { GameAPI } from '../../../services';
import { modalActions } from '../../../store/modalSlice';
import './ThirdCardModal.scss';

export default function ThirdCardModal() {

    const dispatch = useDispatch();
    const { gameId } = useSelector(gameSelector);

    const handleChoice = (event) => {
        const choiceMade = event.target.id;
        GameAPI.postThirdCardChoice(gameId, choiceMade);
        dispatch(modalActions.toggleModal());
    }

    return (
        <>
            <div className="cardmodal">
                <h2 className="cardmodal__heading">Would you like a third card?</h2>
                <div className="cardmodal__button-container">
                    <button className="cardmodal__button-container__yesbutton" id="yes" onClick={(event) => handleChoice(event)}>
                        Yes please
                    </button>
                    <button className="cardmodal__button-container__nobutton" id="no" onClick={(event) => handleChoice(event)}>
                        No thanks
                    </button>
                </div>
            </div>
        </>
    )
}