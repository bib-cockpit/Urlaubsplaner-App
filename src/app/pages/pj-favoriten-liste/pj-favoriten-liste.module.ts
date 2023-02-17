import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PjFavoritenListePage } from './pj-favoriten-liste.page';
import {RouterModule, Routes} from "@angular/router";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PjFavoritenEditorModule} from "../../components-page/pj-favoriten-editor/pj-favoriten-editor.module";
import {PjProjekteAuswahlModule} from "../../components-page/pj-projekte-auswahl/pj-projekte-auswahl.module";
import {AuswahlDialogModule} from "../../components/auswahl-dialog/auswahl-dialog.module";

const routes: Routes = [
  {
    path: '',
    component: PjFavoritenListePage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    CommonModule,
    FormsModule,
    IonicModule,
    PageHeaderMenuModule,
    PageHeaderModule,
    PageFooterModule,
    PjFavoritenEditorModule,
    PjProjekteAuswahlModule,
    AuswahlDialogModule,

  ],
  declarations: [PjFavoritenListePage],
  exports: [
    PjFavoritenListePage
  ]
})
export class PjFavoritenListePageModule {}
