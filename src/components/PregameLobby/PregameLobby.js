import React, { useEffect } from 'react';
import './PregameLobby.scss';
import Navbar from '../Navbar/Navbar.js';
import { useSelector, useDispatch } from 'react-redux';
import { pregameSelector, fetchPlayerInfo, fetchPlayerStatuses } from '../../store/pregameSlice';
import { toastActions } from '../../store/toastSlice.js';
import { socket } from '../../services';

export default function PregameLobby() {

    return (
        <>
            <Navbar />
            <div>
                <main>
                    <h2>IF YOU CAN SEE THIS, JOINED LOBBY SUCCESSFULLY</h2>
                </main>
            </div>
        </>
    )
}