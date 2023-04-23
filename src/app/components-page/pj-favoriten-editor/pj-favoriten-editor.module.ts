import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {PjFavoritenEditorComponent} from "./pj-favoriten-editor.component";
import {InputCloneModule} from "../../components/input-clone/input-clone.module";
import {InputCloneKeeperModule} from "../../components/input-clone-keeper/input-clone-keeper.module";
import {AbstandElementFixedModule} from "../../components/abstand-element-fixed/abstand-element-fixed.module";
import {PageHeaderModule} from "../../components/page-header/page-header.module";
import {PageFooterModule} from "../../components/page-footer/page-footer.module";
import {PageHeaderCenterModule} from "../../components/page-header-center/page-header-center.module";
import {CheckboxClonModule} from "../../components/checkbox-clon/checkbox-clon.module";

@NgModule({
  declarations: [

    PjFavoritenEditorComponent
  ],
  exports: [

    PjFavoritenEditorComponent
  ],
    imports: [

        CommonModule,
        IonicModule,
        InputCloneModule,
        InputCloneKeeperModule,
        AbstandElementFixedModule,
        PageHeaderModule,
        PageFooterModule,
        PageHeaderCenterModule,
        CheckboxClonModule,
    ],
  providers: [

  ]
})
export class PjFavoritenEditorModule {}
