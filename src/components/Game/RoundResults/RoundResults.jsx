import React from 'react';
import { useSelector } from 'react-redux';
import { selectLastRoundResult } from '../../../store/gameSlice';
import './RoundResults.scss';

const yakuLabel = yaku => {
    if (!yaku) return null;
    if (yaku === true) return 'Yaku';
    return yaku;
};

// TODO: Improve layout and styling here
export default function RoundResults() {
    const lastRoundResult = useSelector(selectLastRoundResult);
    if (!lastRoundResult) return null;

    return (
        <div className="roundresults">
            <h2 className="roundresults__heading">Round {lastRoundResult.turn} Results</h2>
            <div className="roundresults__dealer">
                <p className="roundresults__dealer__name">Dealer: <b>{lastRoundResult.dealerUsername}</b></p>
                <p className="roundresults__dealer__hand">Hand value: {lastRoundResult.dealerHandValue}</p>
                {yakuLabel(lastRoundResult.dealerYaku) ? (
                    <p className="roundresults__yaku">{yakuLabel(lastRoundResult.dealerYaku)}</p>
                ) : null}
            </div>
            <ul className="roundresults__list">
                {lastRoundResult.results.map(row => (
                    <li key={row.userId} className="roundresults__list__item">
                        <div className="roundresults__list__item__name">{row.username}</div>
                        <div className="roundresults__list__item__stat">Bet: {row.betAmount}</div>
                        <div className="roundresults__list__item__stat">Hand: {row.handValue}</div>
                        {yakuLabel(row.yaku) ? (
                            <div className="roundresults__yaku">{yakuLabel(row.yaku)}</div>
                        ) : null}
                        <div className={row.delta >= 0 ? "roundresults__list__item__delta--win" : "roundresults__list__item__delta--loss"}>
                            {row.delta >= 0 ? `+${row.delta}` : row.delta}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}