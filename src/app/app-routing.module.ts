import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {SecurityService} from "./services/security/security.service";
import {MsalRedirectComponent} from "@azure/msal-angular";

const routes: Routes = [
  {
    path: 'TestPage',
    loadChildren: () => import('./pages/common-testseite/common-testseite.module').then(m => m.CommonTestseitePageModule),
    canLoad: [SecurityService]
  },
  {
    path: 'RegistrierungPage',
    loadChildren: () => import('./pages/common-registrierung/common-registrierung.module').then(m => m.CommonRegistrierungPageModule),
    canLoad: [SecurityService]
  },
  {
    path: 'LoginPage',
    loadChildren: () => import('./pages/common-login/common-login.module').then(m => m.CommonLoginPageModule),
  },
  {
    path: 'HomePage',
    loadChildren: () => import('./pages/common-home/common-home.module').then(m => m.CommonHomePageModule),
    canLoad: [SecurityService]
  },
  {
    path: 'DebugPage',
    loadChildren: () => import('./pages/common-debug/common-debug.module').then(m => m.CommonDebugPageModule),
  },
  {
    path: 'EinstellungenPage',
    loadChildren: () => import('./pages/common-einstellungen/common-einstellungen.module').then(m => m.CommonEinstellungenPageModule),
  },
  { path: 'ErrorPage',
    loadChildren: () => import('./pages/common-error/common-error.module').then(m => m.CommonErrorPageModule),
  },
  {
    path: 'FiStandortelistePage',
    loadChildren: () => import('./pages/fi-standorteliste/fi-standorteliste.module').then(m => m.FiStandortelistePageModule),
    canLoad: [SecurityService]
  },
  {
    path: 'FiMitarbeiterlistePage',
    loadChildren: () => import('./pages/fi-mitarbeiterliste/fi-mitarbeiterliste.module').then(m => m.FIMitarbeiterlistePageModule),
    canLoad: [SecurityService]
  },
  {
    path: 'PjListePage',
    loadChildren: () => import('./pages/pj-projekt-liste/pj-projekt-liste.module').then(m => m.PjProjektListePageModule),
    canLoad: [SecurityService]
  },
  {
    path: 'PjFavoritenlistePage',
    loadChildren: () => import('./pages/pj-favoriten-liste/pj-favoriten-liste.module').then(m => m.PjFavoritenListePageModule),
    canLoad: [SecurityService]
  },
  {
    path: 'auth',
    component: MsalRedirectComponent
  },
  {
    path: '',
    redirectTo: 'TestPage',
    pathMatch:  'full'
  },
  {
    path: 'PjAufgabenlistePage',
    loadChildren: () => import('./pages/pj-aufgaben-liste/pj-aufgaben-liste.module').then(m => m.PjAufgabenListePageModule)
  },
  /*
  {
    path: 'PjAufgabenlisteMeintagPage',
    loadChildren: () => import('./pages/pj-aufgaben-meintagliste/pj-aufgaben-meintagliste.module').then(m => m.PjAufgabenMeintagListePageModule)
  },

  {
    path: 'PjAufgabenlisteAllePage',
    loadChildren: () => import('./pages/pj-aufgabenliste-alle/pj-aufgabenliste-alle.module').then(m => m.PjAufgabenlisteAllePageModule)
  },
  {
    path: 'PjAufgabenlisteEinzelprojektPage',
    loadChildren: () => import('./pages/pj-aufgabenliste-einzelprojekt/pj-aufgabenliste-einzelprojekt.module').then(m => m.PjAufgabenlisteEinzelprojektPageModule)
  },

   */
  {
    path: 'PjProtokolleListePage',
    loadChildren: () => import('./pages/pj-protokolle-liste/pj-protokolle-liste.module').then(m => m.PjProtokolleListePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [SecurityService]
})
export class AppRoutingModule { }
