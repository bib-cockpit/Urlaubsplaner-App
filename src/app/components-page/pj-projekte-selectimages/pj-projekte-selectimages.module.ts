import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {PjProjeteSelectimagesComponent} from "./pj-projete-selectimages.component";
import {InputCloneModule} from "../../components/input-clone/input-clone.module";
import {InputCloneKeeperModule} from "../../components/input-clone-keeper/input-clone-keeper.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PageHeaderCenterModule} from "../../components/page-header-center/page-header-center.module";
import {PjTeamsFilebrowserModule} from "../../components/pj-teams-filebrowser/pj-teams-filebrowser.module";
import {PjSitesFilebrowserModule} from "../../components/pj-sites-filebrowser/pj-sites-filebrowser.module";
import {
  PjSitesFilebrowserViewerModule
} from "../../components/pj-sites-filebrowser-viewer/pj-sites-filebrowser-viewer.module";

@NgModule({
  declarations: [

    PjProjeteSelectimagesComponent
  ],
  exports: [

    PjProjeteSelectimagesComponent
  ],
  imports: [

    CommonModule,
    IonicModule,
    InputCloneModule,
    InputCloneKeeperModule,
    AbstandElementFixedModule,
    PageHeaderModule,
    PageFooterModule,
    PageHeaderCenterModule,
    PjTeamsFilebrowserModule,
    PjSitesFilebrowserModule,
    PjSitesFilebrowserViewerModule,
  ],
  providers: [

  ]
})
export class PjProjekteSelectimagesModule {}
