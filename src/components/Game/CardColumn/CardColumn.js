import React from "react";
import Card from "../Card/Card";
import { useSelector } from "react-redux";
import { gameSelector } from "../../../store/gameSlice";
import './CardColumn.scss';

export default function CardColumn({column}) {

    const { playerAuth } = useSelector(gameSelector);

    return (
        <div className="card-column">
            <Card 
                src={column.cards[0].src}
                value={column.cards[0].value}
                id={column.cards[0].id}
                defaultHidden={false}
                defaultDisabled={false}
            />
            {column.cards[1] ? 
                <Card
                    src={column.cards[1].src}
                    value={column.cards[1].value}
                    id={column.cards[1].id}
                    defaultHidden={true}
                    defaultDisabled={false}
                />
            : null
            }
            {column.cards[2] ?
                <Card 
                    src={column.cards[2].src}
                    value={column.cards[2].value}
                    id={column.cards[2].id}
                    defaultHidden={false}
                    defaultDisabled={true}
                />
            : null
            }
        </div>
    )
}