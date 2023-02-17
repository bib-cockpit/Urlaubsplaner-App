import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {PjDatepickerComponent} from './pj-datepicker';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [

    PjDatepickerComponent
  ],
  exports: [

    PjDatepickerComponent
  ],
  imports: [

    IonicModule,
    CommonModule,
  ],
  providers: [

  ]
})
export class PjDatepickerModule {}
