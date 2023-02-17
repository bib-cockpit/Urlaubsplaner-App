import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {FiMitarbeiterEditorComponent} from "./fi-mitarbeiter-editor.component";
import {InputCloneModule} from "../../components/input-clone/input-clone.module";
import {InputCloneKeeperModule} from "../../components/input-clone-keeper/input-clone-keeper.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";

@NgModule({
  declarations: [

    FiMitarbeiterEditorComponent
  ],
  exports: [

    FiMitarbeiterEditorComponent
  ],
    imports: [

        CommonModule,
        IonicModule,
        InputCloneModule,
        InputCloneKeeperModule,
        AbstandElementFixedModule,
        CheckboxClonModule,
        PageHeaderModule,
        PageFooterModule
    ],
  providers: [

  ]
})
export class FiMitarbeiterEditorModule {}
