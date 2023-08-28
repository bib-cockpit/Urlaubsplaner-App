import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {RouterModule, Routes} from "@angular/router";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PjFilebrowserPage} from "./pj-filebrowser.page";
import {PjTeamsFilebrowserModule} from "../../components/pj-teams-filebrowser/pj-teams-filebrowser.module";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {
  PjTeamsFilebrowserViewerModule
} from "../../components/pj-teams-filebrowser-viewer/pj-teams-filebrowser-viewer.module";
import {PjSitesFilebrowserModule} from "../../components/pj-sites-filebrowser/pj-sites-filebrowser.module";
import {
    PjSitesFilebrowserViewerModule
} from "../../components/pj-sites-filebrowser-viewer/pj-sites-filebrowser-viewer.module";

const routes: Routes = [
  {
    path: '',
    component: PjFilebrowserPage
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
        PjTeamsFilebrowserModule,
        PdfViewerModule,
        PjTeamsFilebrowserViewerModule,
        PjSitesFilebrowserModule,
        PjSitesFilebrowserViewerModule,


    ],
  declarations: [PjFilebrowserPage],
  exports: [
    PjFilebrowserPage
  ]
})
export class PjFilebrowserPageModule {}
