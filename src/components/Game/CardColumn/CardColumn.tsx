import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import Card from '../Card/Card';
import CardsValueCounter from '../CardsValueCounter/CardsValueCounter';
import { selectCardOwnedBool } from '../../../store/gameSlice';
import type { CardColumn as CardColumnType } from '@shared/game';
import './CardColumn.scss';

export type CardColumnProps = {
	column: CardColumnType;
	columnIndex: number;
};

export default function CardColumn({ column, columnIndex }: CardColumnProps) {
	const secondCardHiddenBool = useSelector(selectCardOwnedBool);
	const [firstCard, secondCard, thirdCard] = column.cards;

	if (!firstCard) return null;

	return (
		<Fragment key={columnIndex}>
			<div className="card-column">
				<Card
					src={firstCard.src}
					value={firstCard.value}
					id={firstCard.id}
					ownerColumn={columnIndex}
					defaultHidden={false}
					defaultDisabled={false}
				/>
				{secondCard ? (
					<Card
						src={secondCard.src}
						value={secondCard.value}
						id={secondCard.id}
						ownerColumn={columnIndex}
						defaultHidden={secondCardHiddenBool}
						defaultDisabled={true}
					/>
				) : null}
				{thirdCard ? (
					<Card
						src={thirdCard.src}
						value={thirdCard.value}
						id={thirdCard.id}
						ownerColumn={columnIndex}
						defaultHidden={false}
						defaultDisabled={true}
					/>
				) : null}
				<CardsValueCounter cards={column.cards} parentColumn={columnIndex} />
			</div>
		</Fragment>
	);
}