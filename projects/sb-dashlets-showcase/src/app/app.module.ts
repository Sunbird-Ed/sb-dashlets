import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {DashletModule} from 'sb-dashlets'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DashletModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
