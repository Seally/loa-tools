import React from "react";
import * as $ from 'jquery';

class CardContainer extends React.Component {
    constructor() {
        super();

        let cards = [];
        $.ajax({
            url: `${process.env.PUBLIC_URL}/fallback-data-source/cards.json`,
            dataType: 'json',
            contentType: 'application/json',
            success: (data, textStatus, jqXHR) => {
                cards = data.data.Cards;
            },
        });

        this.state = { cards: cards };
    }

    componentDidMount() {
    }

    render() {
        return <div>{JSON.stringify(this.state.cards)}</div>
    }
}

export default CardContainer;