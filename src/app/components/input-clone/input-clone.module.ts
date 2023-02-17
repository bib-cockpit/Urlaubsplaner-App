import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {InputCloneComponent} from "./input-clone.component";

@NgModule({
  declarations: [

    InputCloneComponent
  ],
  exports: [

    InputCloneComponent
  ],
  imports: [

    CommonModule,
    IonicModule
  ],
  providers: [

  ]
})
export class InputCloneModule {}
