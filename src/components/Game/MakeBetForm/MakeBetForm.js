import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gameSelector } from '../../../store/gameSlice';
import { modalActions } from '../../../store/modalSlice';
import { useForm, Controller } from 'react-hook-form';
import { GameAPI } from '../../../services';
import Slider from 'react-input-slider';

export default function MakeBetForm() {

    const dispatch = useDispatch();
    const { totalBetAmount, betMax } = useSelector(gameSelector);
    const { handleSubmit, control } = useForm();

    const submitData = (data) => {
        GameAPI.postCardBet(data);
        dispatch(modalActions.toggleModal());
    }

    return (
        <>
            <div className='makebet-form'>
                <h2>How much would you like to bet on this card?</h2>
                <form onSubmit={handleSubmit(submitData)}>
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