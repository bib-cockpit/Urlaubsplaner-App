import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {PjSitesFilebrowserViewerComponent} from "./pj-sites-filebrowser-viewer";

@NgModule({
  declarations: [

    PjSitesFilebrowserViewerComponent,
  ],
  exports: [

    PjSitesFilebrowserViewerComponent,
  ],
  imports: [

    CommonModule,
    IonicModule,
    PdfViewerModule,
  ],
  providers: [

  ]
})
export class PjSitesFilebrowserViewerModule {}
