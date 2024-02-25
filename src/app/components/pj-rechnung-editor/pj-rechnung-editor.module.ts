import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  PjRechnungEditorComponent,
} from "./pj-rechnung-editor";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PageHeaderCenterModule} from "../../components/page-header-center/page-header-center.module";
import {InputCloneModule} from "../input-clone/input-clone.module";

@NgModule({
  declarations: [

    PjRechnungEditorComponent
  ],
  exports: [

    PjRechnungEditorComponent
  ],
  imports: [

    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    PageFooterModule,
    PageHeaderCenterModule,
    InputCloneModule,
  ],
  providers: [

  ]
})
export class PjRechnungEditorModule {}
