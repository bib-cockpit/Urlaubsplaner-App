import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonDebugPage } from './common-debug.page';
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PrettyjsonModule} from "../../pipes/prettyjson.module";

const routes: Routes = [
  {
    path: '',
    component: CommonDebugPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PageHeaderModule,
    AbstandElementFixedModule,
    ReactiveFormsModule,
    PageFooterModule,
    PageHeaderMenuModule,
    PrettyjsonModule,
  ],
  declarations: [CommonDebugPage]
})
export class CommonDebugPageModule {}
