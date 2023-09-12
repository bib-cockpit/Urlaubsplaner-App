import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {PjSitesFilebrowserViewerComponent} from "./pj-sites-filebrowser-viewer";
import {CheckboxClonModule} from "../checkbox-clon/checkbox-clon.module";

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
        CheckboxClonModule,
    ],
  providers: [

  ]
})
export class PjSitesFilebrowserViewerModule {}
