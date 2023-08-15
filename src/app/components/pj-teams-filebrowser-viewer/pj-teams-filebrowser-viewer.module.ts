import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {PjTeamsFilebrowserComponent} from './pj-teams-filebrowser-viewer';
import {CommonModule} from '@angular/common';
import {PdfViewerModule} from "ng2-pdf-viewer";

@NgModule({
  declarations: [

    PjTeamsFilebrowserComponent,
  ],
  exports: [

    PjTeamsFilebrowserComponent,
  ],
  imports: [

    CommonModule,
    IonicModule,
    PdfViewerModule,
  ],
  providers: [

  ]
})
export class PjTeamsFilebrowserViewerModule {}
