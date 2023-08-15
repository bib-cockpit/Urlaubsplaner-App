import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PjBaustelleTagebuchlistePage } from './pj-baustelle-tagebuchliste.page';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {RouterModule, Routes} from "@angular/router";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PjBautagebuchEditorModule} from "../../components-page/pj-bautagebuch-editor/pj-bautagebuch-editor.module";
import {ButtonValueDateModule} from "../../components/button-value-date/button-value-date.module";
import {
    PjBautagebuchEintrageditorModule
} from "../../components-page/pj-bautagebuch-eintrageditor/pj-bautagebuch-eintrageditor.module";
import {PjEmailSendModule} from "../../components-page/pj-email-send/pj-email-send.module";
import {FiMitarbeiterAuswahlModule} from "../../components-page/fi-mitarbeiter-auswahl/fi-mitarbeiter-auswahl.module";
import {PjBeteiligtenAuswahlModule} from "../../components-page/pj-beteiligten-auswahl/pj-beteiligten-auswahl.module";
import {AuswahlDialogModule} from "../../components/auswahl-dialog/auswahl-dialog.module";
import {
    PjProjekteSchnellauswahlModule
} from "../../components-page/pj-projekte-schnellauswahl/pj-projekte-schnellauswahl.module";

const routes: Routes = [
  {
    path: '',
    component: PjBaustelleTagebuchlistePage
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
        PjBautagebuchEditorModule,
        ButtonValueDateModule,
        PjBautagebuchEintrageditorModule,
        PjEmailSendModule,
        FiMitarbeiterAuswahlModule,
        PjBeteiligtenAuswahlModule,
        AuswahlDialogModule,
        PjProjekteSchnellauswahlModule,
    ],
  declarations: [PjBaustelleTagebuchlistePage]
})
export class PjBaustelleTagebuchlistePageModule {}
