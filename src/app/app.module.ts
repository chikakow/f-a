import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreFoundationModule, KendoUiAngularModule } from '@core-foundation/public_api';
import { MiniPortalModule } from '@mini-portal/public_api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreFoundationModule,
    KendoUiAngularModule,
    MiniPortalModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
