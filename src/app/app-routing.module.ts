import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  /*
  {
    path: '404',  loadChildren: () => import('./pages/common-home/common-home.module').then(m => m.CommonHomePageModule),
  },

   */
  {
    path: 'FiStandortelistePage',
    loadChildren: () => import('./pages/fi-standorteliste/fi-standorteliste.module').then(m => m.FiStandortelistePageModule),
  },
  {
    path: 'FiMitarbeiterlistePage',
    loadChildren: () => import('./pages/fi-mitarbeiterliste/fi-mitarbeiterliste.module').then(m => m.FIMitarbeiterlistePageModule),
  },
  {
    path: '',
    loadChildren: () => import('./pages/common-home/common-home.module').then(m => m.CommonHomePageModule),
  },
  {
    path: 'HomePage',
    loadChildren: () => import('./pages/common-home/common-home.module').then(m => m.CommonHomePageModule),
  },
  {
    path: 'DebugPage',
    loadChildren: () => import('./pages/common-debug/common-debug.module').then(m => m.CommonDebugPageModule),
  },
  {
    path: 'EinstellungenPage',
    loadChildren: () => import('./pages/common-einstellungen/common-einstellungen.module').then(m => m.CommonEinstellungenPageModule),
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
})
export class AppRoutingModule { }
