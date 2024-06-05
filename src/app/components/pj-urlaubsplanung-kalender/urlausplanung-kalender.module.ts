import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  UrlaubsplanungKalenderComponent,
} from "./urlausplanung-kalender";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PageHeaderCenterModule} from "../../components/page-header-center/page-header-center.module";

@NgModule({
  declarations: [

    UrlaubsplanungKalenderComponent
  ],
  exports: [

    UrlaubsplanungKalenderComponent
  ],
  imports: [

    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    PageFooterModule,
    PageHeaderCenterModule,
  ],
  providers: [

  ]
})
export class UrlausplanungKalenderModule {}
