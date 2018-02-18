import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Card } from './card';

const loaApi = {
  cards: {
    url: 'https://loapk3.fingertactic.com/card.php',
    options: {
      headers: { 'Content-Type': 'application/json' },
      params: { do: 'GetAllCard' }
    }
  },
  skills: {
    url: 'https://loapk3.fingertactic.com/card.php',
    options: {
      headers: { 'Content-Type': 'application/json' },
      params: { do: 'GetAllSkill' }
    }
  },
  maps: {
    url: 'https://loapk3.fingertactic.com/mapstage.php',
    options: {
      headers: { 'Content-Type': 'application/json' },
      params: { do: 'GetMapStageALL' }
    }
  },
  runes: {
    url: 'https://loapk3.fingertactic.com/rune.php',
    options: {
      headers: { 'Content-Type': 'application/json' },
      params: { do: 'GetAllRune' }
    }
  }
};

@Injectable()
export class LoaApiService {
  cardsJson;
  skillsJson;
  runesJson;
  mapsJson;

  constructor(private http: HttpClient) {
  }

  getCards(): Observable<Card[]> {
    this.loadCardsJson();
    return this.cardsJson.Data.Cards;
  }

  private loadCardsJson(): void {
    if(!this.cardsJson) {
      this.cardsJson = require('./data/cards.json');
    }
  }

  private loadSkillsJson(): void {
    if(!this.skillsJson) {
      this.skillsJson = require('./data/skills.json');
    }
  }

  private loadRunesJson(): void {
    if(!this.runesJson) {
      this.runesJson = require('./data/runes.json');
    }
  }

  private loadMapsJson(): void {
    if(!this.mapsJson) {
      this.mapsJson = require('./data/maps.json');
    }
  }
}
