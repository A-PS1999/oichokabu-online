import React from 'react';
import './MakeBetForm.scss';
import { useSelector, useDispatch } from 'react-redux';
import { selectTotalBetAmount, selectBetMax, selectCurrentlySelectedCard, selectGameId, postCardBet } from '../../../store/gameSlice';
import { modalActions } from '../../../store/modalSlice';
import { useForm, Controller } from 'react-hook-form';
import Slider from 'react-input-slider';
import Modal from '../../Modal/Modal';
import WatchedValue from '../../shared/WatchedValue';
import { sliderStyles } from '../../shared/sliderStyles';

export default function MakeBetForm() {

    const dispatch = useDispatch();
    const totalBetAmount = useSelector(selectTotalBetAmount);
    const betMax = useSelector(selectBetMax);
    const currentlySelectedCard = useSelector(selectCurrentlySelectedCard);
    const gameId = useSelector(selectGameId);
    const { handleSubmit, control } = useForm();

    const submitData = (data) => {
        const betData = { currentCard: currentlySelectedCard, ...data };
        dispatch(postCardBet({ gameId, betData }));
        dispatch(modalActions.toggleModal());
    }

    return (
        <>
            <Modal aria-label="Place your bet" aria-labelledby="makebet-heading">
                <div className='makebet-form'>
                    <h2 id="makebet-heading" className="makebet-form__heading">
                        How much would you like to bet on this card?
                    </h2>
                    <form onSubmit={handleSubmit(submitData)}>
                        <WatchedValue control={control}
                            name="betAmount"
                            defaultVal={100}
                            formTitle="makebet"
                            description="Bet amount:"
                        />
                        <Controller
                            control={control}
                            name="betAmount"
                            defaultValue={100}
                            render={({ field: { value, onChange } }) => (
                                <Slider
                                    axis={"x"}
                                    xmax={betMax - totalBetAmount}
                                    xmin={100}
                                    xstep={100}
                                    onChange={({ x }) => onChange(x)}
                                    x={value}
                                    styles={sliderStyles}
                                />
                            )}
                        />
                        <button type="submit" className='makebet-form__button'>Submit Bet</button>
                    </form>
                </div>
            </Modal>
        </>
    )
}