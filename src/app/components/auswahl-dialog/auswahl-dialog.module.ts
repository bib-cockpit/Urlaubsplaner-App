import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AuswahlDialogComponent} from './auswahl-dialog';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {PageHeaderModule} from "../page-header/page-header.module";
import {PageFooterModule} from "../page-footer/page-footer.module";
import {SafePipeModule} from "../../pipes/safe.pipe.module";

@NgModule({
  declarations: [

    AuswahlDialogComponent
  ],
  exports: [

    AuswahlDialogComponent
  ],
    imports: [

        IonicModule,
        CommonModule,
        FormsModule,
        PageHeaderModule,
        PageFooterModule,
        SafePipeModule,

    ],
  providers: [

  ]
})
export class AuswahlDialogModule {}
