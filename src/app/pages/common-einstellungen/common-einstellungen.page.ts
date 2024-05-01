import {Component, OnDestroy, OnInit} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {ConstProvider} from "../../services/const/const";
import {BasicsProvider} from "../../services/basics/basics";
import {SecurityService} from "../../services/security/security.service";

@Component({
  selector: 'common-einstellungen-page',
  templateUrl: 'common-einstellungen.page.html',
  styleUrls: ['common-einstellungen.page.scss'],
})
export class CommonEinstellungenPage implements OnInit, OnDestroy {

  constructor(public Pool: DatabasePoolService,
              public Const: ConstProvider,
              public Basics: BasicsProvider,
              private Security: SecurityService,
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

      this.Security.CheckSecurity();

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

  ShowCurrentMitarbeiterViewChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      this.Basics.ShowCurrentMitarbeiterView = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'ShowCurrentMitarbeiterViewChanged', this.Debug.Typen.Page);
    }
  }
}
