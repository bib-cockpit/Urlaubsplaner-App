
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {ToolsProvider} from "./services/tools/tools";
import {DebugProvider} from "./services/debug/debug";
import {ConstProvider} from "./services/const/const";
import {BasicsProvider} from "./services/basics/basics";
import {LoadingAnimationService} from "./services/loadinganimation/loadinganimation";
import {MenueService} from "./services/menue/menue.service";
import {DisplayService} from "./services/diplay/display.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService, MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalRedirectComponent,
  MsalService
} from "@azure/msal-angular";
import {BrowserCacheLocation, InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication} from "@azure/msal-browser";
import {LocalstorageService} from "./services/localstorage/localstorage";


const development: boolean             = false;
const appurl: string                   = development ? 'http://localhost:4200' : 'https://lemon-moss-06aa32f03.2.azurestaticapps.net';
const serverurl: string                = development ? 'http://localhost:8080' : 'https://bib-cockpit-server.azurewebsites.net';
const MandantenID: string              = '1bf5df3d-726d-435f-b6dd-658e78e90581';
// const clientidserverauth: string       = 'dd260d53-6b48-4b65-b7bb-ea63e35b0db9';
const clientappregistration: string    = 'e00bbb87-83f4-4001-bd97-28169a9c1123'; // Login funktioniert mit cockpit und p.hornburger
const clientserverregistration: string = 'a816f3fb-bb99-466d-92bc-fb7ccd823430'; // geht nicht da Web / Server Anwendung


const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;

const loggerCallback = (logLevel: LogLevel, message: string) => {
  console.log(message);
};

const MSALInstanceFactory = (): IPublicClientApplication => {

  return new PublicClientApplication({
    auth: {
      clientId:    clientappregistration,
      authority:   'https://login.microsoftonline.com/' + MandantenID,
      redirectUri: appurl
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
};

const MSALInterceptorConfigFactory = () : MsalInterceptorConfiguration => {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
  protectedResourceMap.set(serverurl, ['api://' + clientserverregistration + '/database_access']);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
};

const MSALGuardConfigFactory = (): MsalGuardConfiguration => {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    }
  };
};


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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },

    MsalService,
    MsalGuard,
    MsalBroadcastService,
    ToolsProvider,
    DebugProvider,
    ConstProvider,
    BasicsProvider,
    MenueService,
    LoadingAnimationService,
    DisplayService,
    LocalstorageService,
    ],
  bootstrap: [AppComponent, MsalRedirectComponent],
  exports: [

  ]
})
export class AppModule {}
