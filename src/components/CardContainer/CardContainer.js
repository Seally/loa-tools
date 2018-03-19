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
        let http = require('http');
        let fs = require('fs');


        // let tag = document.createElement("script");
        // tag.src = 'https://loapk3.fingertactic.com/card.php?do=GetAllCard&phpp=FACEBOOK&phpl=EN&pvc=2.0&pvb=2016-09-13 14:52:31&sns=KONGREGATE&origin=';
        //
        // document.getElementsByTagName("body")[0].appendChild(tag);

        // $.ajax({
        //     url: 'https://loapk3.fingertactic.com/card.php?do=GetAllCard&phpp=FACEBOOK&phpl=EN&pvc=2.0&pvb=2016-09-13 14:52:31&sns=KONGREGATE&origin=',
        //     type: 'GET',
        //     dataType: 'jsonp',
        //     success: (data, textStatus, jqXHR) => {
        //         console.log("Success!");
        //         this.cards = data.data.Cards;
        //     },
        //     error: (jqXHR, textStatus, errorThrown) => {
        //         console.log("Error thrown: " + textStatus + " " + errorThrown);
        //     }
        // });
    }

    render() {
        return <div>{JSON.stringify(this.state.cards)}</div>
    }
}

export default CardContainer;