import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {PageHeaderMenuComponent} from "../page-header-menu/page-header-menu.component";
import {ButtonValueModule} from "../button-value/button-value.module";
import {CheckboxClonModule} from "../checkbox-clon/checkbox-clon.module";
import {ButtonValueDateModule} from "../button-value-date/button-value-date.module";

@NgModule({
  declarations: [

    PageHeaderMenuComponent
  ],
  exports: [

    PageHeaderMenuComponent
  ],
    imports: [

        CommonModule,
        IonicModule,
        ButtonValueModule,
        CheckboxClonModule,
        ButtonValueDateModule,
    ],
  providers: [

  ]
})
export class PageHeaderMenuModule {}
