import {SafePipe} from "./pipes/safe.pipe";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {ToolsProvider} from "./services/tools/tools";
import {DebugProvider} from "./services/debug/debug";
import {ConstProvider} from "./services/const/const";
import {BasicsProvider} from "./services/basics/basics";
import {LoadingAnimationService} from "./services/loadinganimation/loadinganimation";
import {SecurityService} from "./services/security/security.service";
import {MenueService} from "./services/menue/menue.service";
import {DisplayService} from "./services/diplay/display.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {MSAL_INSTANCE, MsalBroadcastService, MsalModule, MsalRedirectComponent, MsalService} from "@azure/msal-angular";
import {IPublicClientApplication, PublicClientApplication} from "@azure/msal-browser";
import {LocalstorageService} from "./services/localstorage/localstorage";

const MandantenID: string = '1bf5df3d-726d-435f-b6dd-658e78e90581'; // Tenant ID -> AZURE Portal -> Active Directory -> MandantenID

export const MSALInstanceFactory = (): IPublicClientApplication => new PublicClientApplication({

  auth: {

    clientId:    'dd260d53-6b48-4b65-b7bb-ea63e35b0db9',
    authority:   'https://login.microsoftonline.com/' + MandantenID,
    redirectUri: 'https://lemon-moss-06aa32f03.2.azurestaticapps.net/'
  }
});

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MsalModule,
  ],
  providers: [

    ToolsProvider,
    DebugProvider,
    ConstProvider,
    BasicsProvider,
    MenueService,
    LoadingAnimationService,
    DisplayService,
    SecurityService,
    LocalstorageService,
    MsalService,
    MsalBroadcastService,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    }
    ],
  bootstrap: [AppComponent, MsalRedirectComponent],
  exports: [

  ]
})
export class AppModule {}
