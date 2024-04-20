import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {SecurityService} from "./services/security/security.service";

const routes: Routes = [
  {
    path: '**', pathMatch: 'full', loadChildren: () => import('./pages/common-home/common-home.module').then(m => m.CommonHomePageModule),
    canLoad: [SecurityService]
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
    path: '',
    loadChildren: () => import('./pages/common-home/common-home.module').then(m => m.CommonHomePageModule),
    canLoad: [SecurityService]
  },
  {
    path: 'HomePage',
    loadChildren: () => import('./pages/common-home/common-home.module').then(m => m.CommonHomePageModule),
    canLoad: [SecurityService]
  },
  {
    path: 'DebugPage',
    loadChildren: () => import('./pages/common-debug/common-debug.module').then(m => m.CommonDebugPageModule),
    // canLoad: [SecurityService]
  },
  {
    path: 'EinstellungenPage',
    loadChildren: () => import('./pages/common-einstellungen/common-einstellungen.module').then(m => m.CommonEinstellungenPageModule),
    // canLoad: [SecurityService]
  },
  {
    path: 'UrlaubPlanungPage',
    loadChildren: () => import('./pages/common-urlaub-planung/common-urlaub-planung.module').then(m => m.CommonUrlaubsplanungPageModule),
  },
  {
    path: 'UrlaubUebersichtPage',
    loadChildren: () => import('./pages/common-urlaub-uebersicht/common-urlaub-uebersicht.module').then(m => m.CommonUrlaubsuebersichtPageModule),
  },
  {
    path: 'UrlaubsgesamtuebersichtPage',
    loadChildren: () => import('./pages/common-urlaub-gesamtuebersicht/common-urlaub-gesamtuebersicht.module').then(m => m.CommonUrlaubsgesamtuebersichtPageModule),
  },
  {
    path: 'UrlaubFreigabenPage',
    loadChildren: () => import('./pages/common-urlaub-freigaben/common-urlaub-freigaben.module').then(m => m.CommonUrlaubFreigabenPageModule),
  },
  {
    path: 'UrlaubEinstellungenPage',
    loadChildren: () => import('./pages/common-urlaub-einstellungen/common-urlaub-einstellungen.module').then(m => m.CommonUrlaubEinstellungenPageModule),
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [SecurityService]
})
export class AppRoutingModule { }
