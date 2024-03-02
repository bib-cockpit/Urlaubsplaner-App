import {Component, OnDestroy, OnInit} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {ConstProvider} from "../../services/const/const";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatabaseAuthenticationService} from "../../services/database-authentication/database-authentication.service";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import * as lodash from "lodash-es";

@Component({
  selector: 'common-debug-page',
  templateUrl: './common-debug.page.html',
  styleUrls: ['./common-debug.page.scss'],
})
export class CommonDebugPage implements OnInit, OnDestroy {

  public Title: string;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public Const: ConstProvider,
              public fb: FormBuilder,
              private http: HttpClient,
              public Pool: DatabasePoolService,
              public AuthService: DatabaseAuthenticationService,

  ) {
    try
    {


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Login', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

     // if(lodash.isUndefined(this.DBProjektpunkte.CurrentProjektpunkt)) this.DBProjektpunkte.CurrentProjektpunkt = null;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Debug', 'OnInit', this.Debug.Typen.Page);
    }
  }

  ionViewDidEnter() {

    try {

      this.Title = 'Debug';
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Debug', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }


  ngOnDestroy(): void {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Debug', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  ClearMessagesButtonCLcicked() {

    try {

      this.Debug.Debugmessageliste = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Debug', 'ClearMessagesButtonCLcicked', this.Debug.Typen.Page);
    }
  }

  ChangeShowHomeScreenInfos(event: { status: boolean; index: number; event: any }) {

    try {

      this.Basics.ShowHomeScreenInfos = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Debug', 'ChangeShowHomeScreenInfos', this.Debug.Typen.Page);
    }
  }

  DebugNoExternalEmailChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.Basics.DebugNoExternalEmail = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Debug', 'DebugNoExternalEmailChanged', this.Debug.Typen.Page);
    }
  }

  TestButtonChlicked() {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Debug', 'TestButtonChlicked', this.Debug.Typen.Page);
    }

  }
}
