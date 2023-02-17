import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {InputCloneKeeperComponent} from "./input-clone-keeper.component";

@NgModule({
  declarations: [

    InputCloneKeeperComponent
  ],
  exports: [

    InputCloneKeeperComponent
  ],
  imports: [

    CommonModule,
    IonicModule
  ],
  providers: [

  ]
})
export class InputCloneKeeperModule {}
