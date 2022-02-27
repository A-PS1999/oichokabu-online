import React from 'react';

export default function Card({id, value, src}) {

    return (
        <>
            <button>
                <img src={src} alt="Oicho Kabu card" id={id}  />
            </button>
        </>
    )
}