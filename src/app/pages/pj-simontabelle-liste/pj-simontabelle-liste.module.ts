import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {RouterModule, Routes} from "@angular/router";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {AuswahlDialogModule} from "../../components/auswahl-dialog/auswahl-dialog.module";
import {PjSimontabelleListePage} from "./pj-simontabelle-liste.page";
import {
    PjNotizenkapitelEditorModule
} from "../../components-page/pj-notizenkapitel-editor/pj-notizenkapitel-editor.module";
import {EditorComponent} from "@tinymce/tinymce-angular";
import {FormsModule} from "@angular/forms";
import {
    PjProjekteSchnellauswahlModule
} from "../../components-page/pj-projekte-schnellauswahl/pj-projekte-schnellauswahl.module";
import {PjSimontabelleEditorModule} from "../../components-page/pj-simontabelle-editor/pj-simontabelle-editor.module";
import {
  PjSimontabelleLeistungeneditorModule
} from "../../components-page/pj-simontabelle-leistungeneditor/pj-simontabelle-leistungeneditor.module";
import {FiMitarbeiterAuswahlModule} from "../../components-page/fi-mitarbeiter-auswahl/fi-mitarbeiter-auswahl.module";
import {PjEmailSendModule} from "../../components-page/pj-email-send/pj-email-send.module";
import {
    PjProjektpunktDateKwPickerModule
} from "../../components-page/pj-projektpunkt-date-kw-picker/pj-projektpunkt-date-kw-picker.module";
import {PjRechnungEditorModule} from "../../components/pj-rechnung-editor/pj-rechnung-editor.module";


const routes: Routes = [
  {
    path: '',
    component: PjSimontabelleListePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PageHeaderModule,
    RouterModule.forChild(routes),
    PageHeaderMenuModule,
    PageFooterModule,
    AuswahlDialogModule,
    PjNotizenkapitelEditorModule,
    EditorComponent,
    FormsModule,
    PjProjekteSchnellauswahlModule,
    PjSimontabelleEditorModule,
    PjSimontabelleLeistungeneditorModule,
    FiMitarbeiterAuswahlModule,
    PjEmailSendModule,
    PjProjektpunktDateKwPickerModule,
    PjRechnungEditorModule,


  ],
  declarations: [PjSimontabelleListePage],
  exports: [
    PjSimontabelleListePage
  ]
})
export class PjSimontabelleListePageModule {}
