import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DashletModule } from 'sb-dashlets';
import { DataService } from './data.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DashletModule.forRoot({
      dataService: DataService
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
