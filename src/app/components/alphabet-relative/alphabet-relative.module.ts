import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AlphabetRelativeComponent} from './alphabet-relative';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [

    AlphabetRelativeComponent
  ],
  exports: [

    AlphabetRelativeComponent
  ],
  imports: [

    CommonModule,
    IonicModule
  ],
  providers: [

  ]
})
export class AlphabetRelativeModule {}
