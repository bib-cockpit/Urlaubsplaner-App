import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {PjProjektpunktelisteComponent} from "./pj-projektpunkteliste.component";
import {PjDatepickerModule} from "../pj-datepicker/pj-datepicker.module";
import {CheckboxClonModule} from "../checkbox-clon/checkbox-clon.module";
import {SafePipeModule} from "../../pipes/safe.pipe.module";

@NgModule({
  declarations: [

    PjProjektpunktelisteComponent
  ],
  exports: [

    PjProjektpunktelisteComponent
  ],
    imports: [

        IonicModule,
        CommonModule,
        PjDatepickerModule,
        CheckboxClonModule,
        SafePipeModule,
    ],
  providers: [

  ]
})

export class PjProjektpunktelisteModule {}
