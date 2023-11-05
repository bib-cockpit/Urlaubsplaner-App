import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PjPlanungsmatrixPage } from './pj-planungsmatrix.page';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {FiChangelogEditorModule} from "../../components-page/fi-changelog-editor/fi-changelog-editor.module";
import {
    PjProjekteSchnellauswahlModule
} from "../../components-page/pj-projekte-schnellauswahl/pj-projekte-schnellauswahl.module";
import {PjTeamsFilebrowserModule} from "../../components/pj-teams-filebrowser/pj-teams-filebrowser.module";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";
import {
    PjPlanungsmatrixeintragEditorModule
} from "../../components-page/pj-planungsmatrixeintrag-editor/pj-planungsmatrixeintrag-editor.module";
import {AuswahlDialogModule} from "../../components/auswahl-dialog/auswahl-dialog.module";
import {
    PjProjektpunktDateKwPickerModule
} from "../../components-page/pj-projektpunkt-date-kw-picker/pj-projektpunkt-date-kw-picker.module";

const routes: Routes = [
  {
    path: '',
    component: PjPlanungsmatrixPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        PageHeaderModule,
        AbstandElementFixedModule,
        ReactiveFormsModule,
        PageFooterModule,
        FiChangelogEditorModule,
        PjProjekteSchnellauswahlModule,
        PjTeamsFilebrowserModule,
        PageHeaderMenuModule,
        CheckboxClonModule,
        PjPlanungsmatrixeintragEditorModule,
        AuswahlDialogModule,
        PjProjektpunktDateKwPickerModule,
    ],
  declarations: [PjPlanungsmatrixPage]
})
export class PjPlanungsmatrixModule {}
