import { useSelector } from 'react-redux';
import { selectLastRoundResult } from '../../../store/gameSlice';
import type { YakuResult } from '@shared/game';
import './RoundResults.scss';

const yakuLabel = (yaku: YakuResult): string | null => {
	if (!yaku) return null;
	if (yaku === true) return 'Yaku';
	return yaku;
};

export default function RoundResults() {
	const lastRoundResult = useSelector(selectLastRoundResult);
	if (!lastRoundResult) return null;

	return (
		<div className="roundresults">
			<h2 className="roundresults__heading">Round {lastRoundResult.turn} Results</h2>
			<div className="roundresults__dealer">
				<p className="roundresults__dealer__name">
					Dealer: <b>{lastRoundResult.dealerUsername}</b>
				</p>
				<p className="roundresults__dealer__hand">Hand value: {lastRoundResult.dealerHandValue}</p>
				{yakuLabel(lastRoundResult.dealerYaku) ? (
					<p className="roundresults__yaku">{yakuLabel(lastRoundResult.dealerYaku)}</p>
				) : null}
			</div>
			<ul className="roundresults__list">
				{lastRoundResult.results.map((row) => (
					<li key={row.userId} className="roundresults__list__item">
						<div className="roundresults__list__item__name">{row.username}</div>
						<div className="roundresults__list__item">Bet: {row.betAmount}</div>
						<div className="roundresults__list__item">Hand: {row.handValue}</div>
						{yakuLabel(row.yaku) ? (
							<div className="roundresults__yaku">{yakuLabel(row.yaku)}</div>
						) : null}
						<div
							className={
								row.delta >= 0
									? 'roundresults__list__item__delta--win'
									: 'roundresults__list__item__delta--loss'
							}
						>
							{row.delta >= 0 ? `+${row.delta}` : row.delta}
						</div>
					</li>
				))}
			</ul>
			{lastRoundResult.busted && lastRoundResult.busted.length > 0 ? (
				<div className="roundresults__busted">
					{lastRoundResult.busted.map((busted) => (
						<p key={busted.userId} className="roundresults__busted__item">
							{busted.username} busted
						</p>
					))}
				</div>
			) : null}
		</div>
	);
}