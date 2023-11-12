import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {RouterModule, Routes} from "@angular/router";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {AuswahlDialogModule} from "../../components/auswahl-dialog/auswahl-dialog.module";
import {FiMitarbeiterAuswahlModule} from "../../components-page/fi-mitarbeiter-auswahl/fi-mitarbeiter-auswahl.module";
import {PjBeteiligtenAuswahlModule} from "../../components-page/pj-beteiligten-auswahl/pj-beteiligten-auswahl.module";
import {PjProtokolleListePage} from "./pj-protokolle-liste.page";
import {PjProtokollEditorModule} from "../../components-page/pj-protokoll-editor/pj-protokoll-editor.module";
import {PjProjektpunktEditorModule} from "../../components-page/pj-projektpunkt-editor/pj-projektpunkt-editor.module";
import {PjGebaeudeRaumauswahlModule} from "../../components-page/pj-gebaeude-raumauswahl/pj-gebaeude-raumauswahl.module";
import {PjProtokollListefilterModule} from "../../components-page/pj-protokoll-listefilter/pj-protokoll-listefilter.module";
import {
    PjProjektpunktDateKwPickerModule
} from "../../components-page/pj-projektpunkt-date-kw-picker/pj-projektpunkt-date-kw-picker.module";
import {PjEmailSendModule} from "../../components-page/pj-email-send/pj-email-send.module";
import {
    PjProjekteSchnellauswahlModule
} from "../../components-page/pj-projekte-schnellauswahl/pj-projekte-schnellauswahl.module";
import {
    PjSitesFilebrowserViewerModule
} from "../../components/pj-sites-filebrowser-viewer/pj-sites-filebrowser-viewer.module";
import {PjSitesFilebrowserModule} from "../../components/pj-sites-filebrowser/pj-sites-filebrowser.module";
import {
  PjProjekteSelectfilefolderModule
} from "../../components-page/pj-projekte-selectfilefolder/pj-projekte-selectfilefolder.module";
import {
  PjProjekteSelectimagesModule
} from "../../components-page/pj-projekte-selectimages/pj-projekte-selectimages.module";
import {PjFirmenAuswahlModule} from "../../components-page/pj-firmen-auswahl/pj-firmen-auswahl.module";


const routes: Routes = [
  {
    path: '',
    component: PjProtokolleListePage
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
        FiMitarbeiterAuswahlModule,
        PjBeteiligtenAuswahlModule,
        PjProtokollEditorModule,
        PjProjektpunktEditorModule,
        PjGebaeudeRaumauswahlModule,
        PjProtokollListefilterModule,
        PjProjektpunktDateKwPickerModule,
        PjEmailSendModule,
        PjProjekteSchnellauswahlModule,
        PjSitesFilebrowserViewerModule,
        PjSitesFilebrowserModule,
        PjProjekteSelectfilefolderModule,
        PjProjekteSelectimagesModule,
        PjFirmenAuswahlModule,


    ],
  declarations: [PjProtokolleListePage],
  exports: [
    PjProtokolleListePage
  ]
})
export class PjProtokolleListePageModule {}
