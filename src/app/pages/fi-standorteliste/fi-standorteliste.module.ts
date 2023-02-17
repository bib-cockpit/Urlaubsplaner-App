import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {FiStandortelistePage} from './fi-standorteliste';
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {AlphabetModule} from "../../components/alphabet/alphabet.module";
import {FiStandortEditorModule} from "../../components-page/fi-standort-editor/fi-standort-editor.module";
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PageHeaderMenuModule} from "../../components/page-header-menu/page-header-menu.module";
import {PageModalKeepermodule} from "../../components/page-modal-keeper/page-modal-keeper.module";


const routes: Routes = [
  {
    path: '',
    component: FiStandortelistePage
  }
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AbstandElementFixedModule,
    AlphabetModule,
    FiStandortEditorModule,
    PageHeaderModule,
    PageFooterModule,
    PageHeaderMenuModule,
    PageModalKeepermodule
  ],
  declarations: [FiStandortelistePage]
})
export class FiStandortelistePageModule {}
