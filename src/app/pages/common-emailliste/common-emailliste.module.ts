import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {CommonEmaillistePage} from './common-emailiste';
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {AlphabetModule} from "../../components/alphabet/alphabet.module";
import {FiStandortEditorModule} from "../../components-page/fi-standort-editor/fi-standort-editor.module";
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PageModalKeepermodule} from "../../components/page-modal-keeper/page-modal-keeper.module";
// import {EditorComponent} from "@tinymce/tinymce-angular";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";
import {PjProjektpunktEditorModule} from "../../components-page/pj-projektpunkt-editor/pj-projektpunkt-editor.module";
import {
  PjProjektpunktStatusdatePickerModule
} from "../../components-page/pj-projektpunkt-statusdate-picker/pj-projektpunkt-statusdate-picker.module";
import {
  PjProjektpunktDateKwPickerModule
} from "../../components-page/pj-projektpunkt-date-kw-picker/pj-projektpunkt-date-kw-picker.module";
import {FiMitarbeiterAuswahlModule} from "../../components-page/fi-mitarbeiter-auswahl/fi-mitarbeiter-auswahl.module";
import {PjBeteiligtenAuswahlModule} from "../../components-page/pj-beteiligten-auswahl/pj-beteiligten-auswahl.module";
import {
  PjProjekteSchnellauswahlModule
} from "../../components-page/pj-projekte-schnellauswahl/pj-projekte-schnellauswahl.module";
import {PjBeteiligtenEditorModule} from "../../components-page/pj-beteiligten-editor/pj-beteiligten-editor.module";
import {AuswahlDialogModule} from "../../components/auswahl-dialog/auswahl-dialog.module";


const routes: Routes = [
  {
    path: '',
    component: CommonEmaillistePage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AbstandElementFixedModule,
    AlphabetModule,
    FiStandortEditorModule,
    PageHeaderModule,
    PageFooterModule,
    PageHeaderMenuModule,
    PageModalKeepermodule,
    // EditorComponent,
    CheckboxClonModule,
    PjProjektpunktEditorModule,
    PjProjektpunktStatusdatePickerModule,
    PjProjektpunktDateKwPickerModule,
    FiMitarbeiterAuswahlModule,
    PjBeteiligtenAuswahlModule,
    PjProjekteSchnellauswahlModule,
    PjBeteiligtenEditorModule,
    AuswahlDialogModule
  ],
  declarations: [CommonEmaillistePage]
})
export class CommonEmaillistePageModule {}
