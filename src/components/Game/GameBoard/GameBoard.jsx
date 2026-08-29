import React from 'react';
import { useSelector } from 'react-redux';
import {
    selectCurrentTurn, selectTurnMax, selectCurrentPlayer,
    selectCurrentDealerData, selectCardsOnBoard, selectPlayers,
    selectCurrentPhase
} from '../../../store/gameSlice.js';
import CardColumn from '../CardColumn/CardColumn';
import CardsValueCounter from '../CardsValueCounter/CardsValueCounter';
import Card from '../Card/Card';
import MakeBetForm from '../MakeBetForm/MakeBetForm';
import ThirdCardModal from '../ThirdCardModal/ThirdCardModal';
import './GameBoard.scss';

export default function GameBoard() {
    const currentTurn = useSelector(selectCurrentTurn);
    const turnMax = useSelector(selectTurnMax);
    const currentPlayer = useSelector(selectCurrentPlayer);
    const currentDealer = useSelector(selectCurrentDealerData);
    const cardsOnBoard = useSelector(selectCardsOnBoard);
    const Players = useSelector(selectPlayers);
    const currentPhase = useSelector(selectCurrentPhase);

    return (
        <>
            {currentPhase === "bettingPhase" ? <MakeBetForm /> : <ThirdCardModal />}
            <div className="maingame">
                <div className="maingame__turninfo">
                    <h2 className="maingame__turninfo__text">Turn: {currentTurn}/{turnMax}</h2>
                    <h2 className="maingame__turninfo__text">Current Player: {currentPlayer.username}</h2>
                </div>
                {currentDealer ? (
                    <>
                        <div className="maingame__dealerinfo">
                            <p>Dealer: <b>{currentDealer.username}</b></p>
                        </div>
                        <div className="maingame__dealercards-container">
                            {currentDealer.cardBet.map(card => {
                                return (
                                    <Card
                                        key={card.id}
                                        id={card.id}
                                        value={card.value}
                                        src={card.src}
                                        defaultHidden={false}
                                        defaultDisabled={true}
                                    />
                                )
                            })}
                            <CardsValueCounter cards={currentDealer.cardBet} parentColumn={'D'} />
                        </div>
                    </>
                ) : (null)}
                <div className="maingame__cardcolumn-container">
                    {cardsOnBoard.length > 0 ? cardsOnBoard.map((column, index) => {
                        return (
                            <CardColumn key={index} column={column} columnIndex={index} />
                        )
                    })
                        : <h2>Loading...</h2>
                    }
                </div>
                <div className="maingame__players-container">
                    <p className="maingame__players-container__heading">Players</p>
                    {Players.map((player) => {
                        return (
                            <React.Fragment key={player.id}>
                                <div className="maingame__player">
                                    {player.isDealer ? (
                                        <div className='maingame__player__dealerstatus'>親</div>
                                    ) : (
                                        <div className='maingame__player__dealerstatus'>子</div>
                                    )}
                                    <div key={player.id} className="maingame__player__playerinfo">
                                        <div className='maingame__player__playerinfo__username'>{player.username}</div>
                                        <div className='maingame__player__playerinfo__chips'>Chips: {player.chips}</div>
                                    </div>
                                </div>
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>
        </>
    )
}