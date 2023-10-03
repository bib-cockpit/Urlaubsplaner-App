import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PjBaustelleLoplistePage } from './pj-baustelle-lopliste.page';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {RouterModule, Routes} from "@angular/router";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {
    PjProjekteSchnellauswahlModule
} from "../../components-page/pj-projekte-schnellauswahl/pj-projekte-schnellauswahl.module";
import {
    PjBaustelleLoplisteEditorModule
} from "../../components-page/pj-baustelle-lopliste-editor/pj-baustelle-lopliste-editor.module";
import {FiMitarbeiterAuswahlModule} from "../../components-page/fi-mitarbeiter-auswahl/fi-mitarbeiter-auswahl.module";
import {AuswahlDialogModule} from "../../components/auswahl-dialog/auswahl-dialog.module";
import {PjBeteiligtenAuswahlModule} from "../../components-page/pj-beteiligten-auswahl/pj-beteiligten-auswahl.module";
import {
    PjBaustelleLoplisteEintrageditorModule
} from "../../components-page/pj-baustelle-lopliste-eintrageditor/pj-baustelle-lopliste-eintrageditor.module";
import {
  PjProjektpunktDateKwPickerModule
} from "../../components-page/pj-projektpunkt-date-kw-picker/pj-projektpunkt-date-kw-picker.module";
import {
    PjGebaeudeRaumauswahlModule
} from "../../components-page/pj-gebaeude-raumauswahl/pj-gebaeude-raumauswahl.module";
import {SafePipeModule} from "../../pipes/safe.pipe.module";
import {PjEmailSendModule} from "../../components-page/pj-email-send/pj-email-send.module";
import {
    PjProjekteSelectimagesModule
} from "../../components-page/pj-projekte-selectimages/pj-projekte-selectimages.module";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";

const routes: Routes = [
  {
    path: '',
    component: PjBaustelleLoplistePage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PageHeaderModule,
        RouterModule.forChild(routes),
        PageHeaderMenuModule,
        PageFooterModule,
        PjProjekteSchnellauswahlModule,
        PjBaustelleLoplisteEditorModule,
        FiMitarbeiterAuswahlModule,
        AuswahlDialogModule,
        PjBeteiligtenAuswahlModule,
        PjBaustelleLoplisteEintrageditorModule,
        PjProjektpunktDateKwPickerModule,
        PjGebaeudeRaumauswahlModule,
        SafePipeModule,
        PjEmailSendModule,
        PjProjekteSelectimagesModule,
        CheckboxClonModule,
        AbstandElementFixedModule,
    ],
  declarations: [PjBaustelleLoplistePage]
})
export class PjBaustelleLoplistePageModule {}
