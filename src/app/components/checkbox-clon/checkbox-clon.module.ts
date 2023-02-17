import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {CheckboxClonComponent} from "./checkbox-clon.component";

@NgModule({
  declarations: [

    CheckboxClonComponent
  ],
  exports: [

    CheckboxClonComponent
  ],
  imports: [

    CommonModule,
    IonicModule,
  ],
  providers: [

  ]
})
export class CheckboxClonModule {}
