import React from 'react';
import './MakeBetForm.scss';
import { useSelector, useDispatch } from 'react-redux';
import { selectTotalBetAmount, selectBetMax, selectPlayerAuth, selectCurrentlySelectedCard, selectGameId } from '../../../store/gameSlice';
import { modalActions } from '../../../store/modalSlice';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { GameAPI } from '../../../services';
import Slider from 'react-input-slider';
import { WatchedValue, sliderStyles } from '../../shared/sliderStyles';

export default function MakeBetForm() {

    const dispatch = useDispatch();
    const totalBetAmount = useSelector(selectTotalBetAmount);
    const betMax = useSelector(selectBetMax);
    const playerAuth = useSelector(selectPlayerAuth);
    const currentlySelectedCard = useSelector(selectCurrentlySelectedCard);
    const gameId = useSelector(selectGameId);
    const { register, handleSubmit, control } = useForm();

    const submitData = (data) => {
        GameAPI.postCardBet(gameId, data);
        dispatch(modalActions.toggleModal());
    }

    return (
        <>
            <div className='makebet-form'>
                <h2 className="makebet-form__heading">How much would you like to bet on this card?</h2>
                <form onSubmit={handleSubmit(submitData)}>
                    <input type="hidden" {...register("user_id", { value: playerAuth.id })} />
                    <input type="hidden" {...register("current_card", { value: currentlySelectedCard })} />
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
        </>
    )
}