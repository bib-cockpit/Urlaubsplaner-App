import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {RouterModule, Routes} from "@angular/router";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {AuswahlDialogModule} from "../../components/auswahl-dialog/auswahl-dialog.module";
import {PjNotizenListePage} from "./pj-notizen-liste.page";
import {
    PjNotizenkapitelEditorModule
} from "../../components-page/pj-notizenkapitel-editor/pj-notizenkapitel-editor.module";
import {EditorComponent} from "@tinymce/tinymce-angular";
import {FormsModule} from "@angular/forms";
import {
    PjProjekteSchnellauswahlModule
} from "../../components-page/pj-projekte-schnellauswahl/pj-projekte-schnellauswahl.module";


const routes: Routes = [
  {
    path: '',
    component: PjNotizenListePage
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


    ],
  declarations: [PjNotizenListePage],
  exports: [
    PjNotizenListePage
  ]
})
export class PjNotizenListePageModule {}
