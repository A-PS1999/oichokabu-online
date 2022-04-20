import React from "react";
import Card from "../Card/Card";
import CardsValueCounter from "../CardsValueCounter/CardsValueCounter";
import { useSelector } from "react-redux";
import { selectCardOwnedBool } from "../../../store/gameSlice";
import './CardColumn.scss';

export default function CardColumn({ column, columnIndex }) {

    const secondCardHiddenBool = useSelector(selectCardOwnedBool);

    return (
        <React.Fragment key={columnIndex}>
            <div className="card-column">
                <Card 
                    src={column.cards[0].src}
                    value={column.cards[0].value}
                    id={column.cards[0].id}
                    ownerColumn={columnIndex}
                    defaultHidden={false}
                    defaultDisabled={false}
                />
                {column.cards[1] ? 
                    <Card
                        src={column.cards[1].src}
                        value={column.cards[1].value}
                        id={column.cards[1].id}
                        ownerColumn={columnIndex}
                        defaultHidden={secondCardHiddenBool}
                        defaultDisabled={false}
                    />
                : null
                }
                {column.cards[2] ?
                    <Card 
                        src={column.cards[2].src}
                        value={column.cards[2].value}
                        id={column.cards[2].id}
                        ownerColumn={columnIndex}
                        defaultHidden={false}
                        defaultDisabled={true}
                    />
                : null
                }
                <CardsValueCounter cards={column.cards} parentColumn={columnIndex} />
            </div>
        </React.Fragment>
    )
}