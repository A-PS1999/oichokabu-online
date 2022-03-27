import React from 'react';
import './MakeBetForm.scss';
import { useSelector, useDispatch } from 'react-redux';
import { gameSelector } from '../../../store/gameSlice';
import { modalActions } from '../../../store/modalSlice';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { GameAPI } from '../../../services';
import Slider from 'react-input-slider';

function BetAmountWatched({ control }) {
    const betAmountValue = useWatch({
        control,
        name: "betAmount",
        defaultValue: 100
    })

    return <div className="makebet-form__slider-heading">Bet amount: {betAmountValue}</div>
}

export default function MakeBetForm() {

    const dispatch = useDispatch();
    const { totalBetAmount, betMax, playerId, currentlySelectedCard, gameId} = useSelector(gameSelector);
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
                    <input type="hidden" {...register("user_id", { value: playerId })} />
                    <input type="hidden" {...register("card_id", { value: currentlySelectedCard })} />
                    <BetAmountWatched control={control} />
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
                                styles={{
									active: {
										backgroundColor: '#BC002D'
									},
									track: {
										marginBottom: '1.3rem',
										width: '292px'
									}
								}}
                            />
                        )}
                    />
                    <button type="submit" className='makebet-form__button'>Submit Bet</button>
                </form>
            </div>
        </>
    )
}