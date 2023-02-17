import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {AlphabetComponent} from './alphabet';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [

    AlphabetComponent
  ],
  exports: [

    AlphabetComponent
  ],
  imports: [

      CommonModule,
    IonicModule
  ],
  providers: [

  ]
})
export class AlphabetModule {}
