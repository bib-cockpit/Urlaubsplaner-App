import {Component, OnDestroy, OnInit} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {ConstProvider} from "../../services/const/const";
import {BasicsProvider} from "../../services/basics/basics";
import {SecurityService} from "../../services/security/security.service";
import {
  DatabaseAppeinstellungenService
} from "../../services/database-appeinstellungen/database-appeinstellungen.service";
import {Subscription} from "rxjs";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import moment from "moment";
import {Urlauzeitspannenstruktur} from "../../dataclasses/urlauzeitspannenstruktur";
import {Urlaubsstruktur} from "../../dataclasses/urlaubsstruktur";
import * as lodash from "lodash-es";
import {DatabaseUrlaubService} from "../../services/database-urlaub/database-urlaub.service";

@Component({
  selector: 'common-einstellungen-page',
  templateUrl: 'common-einstellungen.page.html',
  styleUrls: ['common-einstellungen.page.scss'],
})
export class CommonEinstellungenPage implements OnInit, OnDestroy {

  private DataSubscription: Subscription;
  public Vertreterliste: Mitarbeiterstruktur[];
  public Freigeberliste: Mitarbeiterstruktur[];

  constructor(public Pool: DatabasePoolService,
              public Const: ConstProvider,
              public Basics: BasicsProvider,
              private Security: SecurityService,
              private DBUrlaub: DatabaseUrlaubService,
              private DB: DatabaseAppeinstellungenService,
              public Debug: DebugProvider) {
    try {

      this.DataSubscription = null;
      this.Vertreterliste   = [];
      this.Freigeberliste   = [];


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Einstellungen', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

      this.DataSubscription.unsubscribe();
      this.DataSubscription = null;


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

      this.Security.CheckSecurity();

      this.DataSubscription = this.Pool.LoadingAllDataFinished.subscribe(() => {

        this.PrepareData();
      });



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'OnInit', this.Debug.Typen.Page);
    }
  }

  DebugNoExternalEmaillCheckedChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      this.Pool.Appeinstellungen.DebugNoExternalEmail = event.status;

      this.DB.SaveAppeinstellungen();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'DebugNoExternalEmaillCheckedChanged', this.Debug.Typen.Page);
    }
  }

  ShowHomescreeninfosChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      this.Pool.Appeinstellungen.ShowHomeScreenInfos = event.status;

      this.DB.SaveAppeinstellungen();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'ShowHomescreeninfosChanged', this.Debug.Typen.Page);
    }
  }

  StartseiteChangedHandler(event: any) {

    try {

      this.Pool.Appeinstellungen.AdminStartseite = event.detail.value;

      this.DB.SaveAppeinstellungen();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'StartseiteChangedHandler', this.Debug.Typen.Page);
    }
  }

  WartungsmodusCheckChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      this.Pool.Appeinstellungen.Wartungsmodus = event.status;

      this.DB.SaveAppeinstellungen();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'WartungsmodusCheckChanged', this.Debug.Typen.Page);
    }
  }

  private PrepareData() {

    try {

      let Mitarbeiter: Mitarbeiterstruktur;
      let CurrentMitarbeiter: Mitarbeiterstruktur;
      let Jahr: number = moment().year();
      let Urlaub: Urlaubsstruktur;
      let CurrentZeitspanne: Urlauzeitspannenstruktur;


      this.Vertreterliste = [];

      for(CurrentMitarbeiter of this.Pool.Mitarbeiterliste) {

        CurrentMitarbeiter.Vertretungenanfragenanzahl = 0;
        CurrentMitarbeiter.Freigabenanfragenanzahl    = 0;

        Urlaub = lodash.find(CurrentMitarbeiter.Urlaubsliste, (currenturlaub: Urlaubsstruktur) => {

          return currenturlaub.Jahr === Jahr;
        });

        if(lodash.isUndefined(Urlaub) === false) {

          for(CurrentZeitspanne of Urlaub.Urlaubzeitspannen) {

            switch (CurrentZeitspanne.Status) {

              case this.DBUrlaub.Urlaubstatusvarianten.Vertreteranfrage:

                Mitarbeiter = lodash.find(this.Vertreterliste, {_id: CurrentMitarbeiter._id});

                if(lodash.isUndefined(Mitarbeiter)) {

                  this.Vertreterliste.push(CurrentMitarbeiter);
                }
                else {

                  CurrentMitarbeiter.Vertretungenanfragenanzahl++;
                }


                break;

              case this.DBUrlaub.Urlaubstatusvarianten.Vertreterfreigabe:

                Mitarbeiter = lodash.find(this.Freigeberliste, {_id: CurrentMitarbeiter._id});

                if(lodash.isUndefined(Mitarbeiter)) {

                  this.Freigeberliste.push(CurrentMitarbeiter);
                }
                else {

                  CurrentMitarbeiter.Freigabenanfragenanzahl++;
                }

                break;
            }
          }
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'PrepareData', this.Debug.Typen.Page);
    }
  }
}
