import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonErrorPage } from './common-error.page';
import {PageHeaderModule} from '../../components/page-header/page-header.module';
import {SafePipeModule} from "../../pipes/safe.pipe.module";

const routes: Routes = [
  {
    path: '',
    component: CommonErrorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageHeaderModule,
    RouterModule.forChild(routes),
    SafePipeModule
  ],
  declarations: [CommonErrorPage]
})
export class CommonErrorPageModule {}
