import React, { useEffect, useState } from 'react';
import './Card.scss';

export default function Card({id, value, src, isHidden}) {

    const [cardValue, setCardValue] = useState(null);

    useEffect(() => {
        setCardValue(value);
    }, [value])

    if (isHidden) {
        return (
            <>
                <button className='card-button'>
                    <img src="/cards/cardback.jpg" alt="Oicho Kabu card" id={id} />
                </button>
            </>
        )
    } else {
        return (
            <>
                <button className='card-button'>
                    <img src={src} alt="Oicho Kabu card" id={id}  />
                </button>
            </>
        )
    }
}