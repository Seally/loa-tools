import { Component, OnInit } from '@angular/core';
import { LoaApiService } from '../loa-api.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  cards;

  constructor(private loaApi: LoaApiService) { }

  ngOnInit() : void {
    this.cards = this.loaApi.getCards();
  }

}
