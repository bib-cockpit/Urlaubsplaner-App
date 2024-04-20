import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenueService} from "../../services/menue/menue.service";
import {DebugProvider} from "../../services/debug/debug";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {HttpErrorResponse} from "@angular/common/http";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";
import {ConstProvider} from "../../services/const/const";
import {BasicsProvider} from "../../services/basics/basics";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import {Subscription} from "rxjs";

@Component({
  selector: 'common-einstellungen-page',
  templateUrl: 'common-einstellungen.page.html',
  styleUrls: ['common-einstellungen.page.scss'],
})
export class CommonEinstellungenPage implements OnInit, OnDestroy {

  constructor(public MitarbeitersettingsDB: DatabaseMitarbeitersettingsService,
              public Pool: DatabasePoolService,
              public Const: ConstProvider,
              public Basics: BasicsProvider,
              public Debug: DebugProvider) {

    try {




    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Einstellungen', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'OnInit', this.Debug.Typen.Page);
    }

  }


  DebugNoExternalEmaillCheckedChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      this.Basics.DebugNoExternalEmail = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'DebugNoExternalEmaillCheckedChanged', this.Debug.Typen.Page);
    }
  }
}
