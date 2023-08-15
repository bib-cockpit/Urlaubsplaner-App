import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonPdfviewPage } from './common-pdfview.page';
import {PageHeaderModule} from '../../components/page-header/page-header.module';
import {SafePipeModule} from "../../pipes/safe.pipe.module";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";

const routes: Routes = [
  {
    path: '',
    component: CommonPdfviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageHeaderModule,
    RouterModule.forChild(routes),
    SafePipeModule,
    PdfViewerModule,
    PageFooterModule
  ],
  declarations: [CommonPdfviewPage]
})
export class CommonPdfViewerPageModule {}
