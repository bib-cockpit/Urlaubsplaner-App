import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {AbstandElementFixedComponent} from './abstand-element-fixed.component';

@NgModule({
  declarations: [

    AbstandElementFixedComponent,
  ],
  exports: [

    AbstandElementFixedComponent
  ],
  imports: [

    CommonModule,
    IonicModule
  ],
  providers: [

  ]
})
export class AbstandElementFixedModule {}
