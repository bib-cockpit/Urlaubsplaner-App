import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {InputCloneModule} from "../../components/input-clone/input-clone.module";
import {InputCloneKeeperModule} from "../../components/input-clone-keeper/input-clone-keeper.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {PjSimontabelleEditorComponent} from "./pj-simontabelle-editor.component";
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";
import {EditorComponent} from "@tinymce/tinymce-angular";
import {FormsModule} from "@angular/forms";
import {ButtonValueModule} from "../../components/button-value/button-value.module";

@NgModule({
  declarations: [

    PjSimontabelleEditorComponent
  ],
  exports: [

    PjSimontabelleEditorComponent
  ],
  imports: [

    CommonModule,
    IonicModule,
    InputCloneModule,
    InputCloneKeeperModule,
    AbstandElementFixedModule,
    PageHeaderModule,
    PageFooterModule,
    FormsModule,
    CheckboxClonModule,
    EditorComponent,
    ButtonValueModule,
  ],
  providers: [

  ]
})
export class PjSimontabelleEditorModule {}
