import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonHomePage } from './common-home.page';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {FiChangelogEditorModule} from "../../components-page/fi-changelog-editor/fi-changelog-editor.module";
import {
    PjProjekteSchnellauswahlModule
} from "../../components-page/pj-projekte-schnellauswahl/pj-projekte-schnellauswahl.module";
import {PjTeamsFilebrowserModule} from "../../components/pj-teams-filebrowser/pj-teams-filebrowser.module";

const routes: Routes = [
  {
    path: '',
    component: CommonHomePage
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
    ],
  declarations: [CommonHomePage]
})
export class CommonHomePageModule {}
