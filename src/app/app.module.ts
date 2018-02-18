import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoaApiService } from './loa-api.service';
import { CardsComponent } from './cards/cards.component';


@NgModule({
  declarations: [
    AppComponent,
    CardsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    LoaApiService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
