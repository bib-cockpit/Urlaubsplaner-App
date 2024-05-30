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
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {loadFromPath} from "@ionic/cli/lib/ssh-config";
import {ToolsProvider} from "../../services/tools/tools";

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
              private Tools: ToolsProvider,
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


      this.DataSubscription = this.Pool.LoadingAllDataFinished.subscribe(() => {

        this.PrepareData();
      });

      this.PrepareData();

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

  async StartseiteChangedHandler(event: any) {

    try {

      this.Pool.Appeinstellungen.AdminStartseite = event.detail.value;

      await this.DB.SaveAppeinstellungen();

      this.Tools.ShowHinweisDialog('App wird neu gestartet.....');

      window.setTimeout(() => {

        location.replace(this.Pool.ApplicationURL)

      },500);

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
      let Standort: Standortestruktur;
      let Vertreter: Mitarbeiterstruktur;
      let Freigeber: Mitarbeiterstruktur;

      this.Vertreterliste = [];
      this.Freigeberliste = [];

      for(CurrentMitarbeiter of this.Pool.Mitarbeiterliste) {

        Urlaub = lodash.find(CurrentMitarbeiter.Urlaubsliste, (currenturlaub: Urlaubsstruktur) => {

          return currenturlaub.Jahr === Jahr;
        });

        if(lodash.isUndefined(Urlaub) === false) {

          for(CurrentZeitspanne of Urlaub.Urlaubzeitspannen) {

            switch (CurrentZeitspanne.Status) {

              case this.DBUrlaub.Urlaubstatusvarianten.Vertreteranfrage:

                for(let Konversation of CurrentZeitspanne.Vertretungskonversationliste) {

                  Vertreter   = lodash.cloneDeep(lodash.find(this.Pool.Mitarbeiterliste, { _id: Konversation.VertreterID }));
                  Mitarbeiter = lodash.find(this.Vertreterliste,        { _id: Konversation.VertreterID });

                  if(lodash.isUndefined(Mitarbeiter)) {

                    Vertreter.Vertretungenanfragenanzahl  = 1;
                    Vertreter.Selected                    = false;
                    Vertreter.UrlaubanfrageReminderSended = false;

                    this.Vertreterliste.push(Vertreter);
                  }
                  else {

                    Mitarbeiter.Vertretungenanfragenanzahl++;
                  }
                }

                break;

              case this.DBUrlaub.Urlaubstatusvarianten.Vertreterfreigabe:

                Standort = lodash.find(this.Pool.Standorteliste, {_id: CurrentMitarbeiter.StandortID});

                if(lodash.isUndefined(Standort) === false) {

                  for(let FreigeberID of Standort.Urlaubfreigabepersonen) {

                    Freigeber   = lodash.cloneDeep(lodash.find(this.Pool.Mitarbeiterliste, { _id: FreigeberID }));
                    Mitarbeiter = lodash.find(this.Freigeberliste,        { _id: FreigeberID });

                    if(lodash.isUndefined(Mitarbeiter) === true) {

                      Freigeber.Freigabenanfragenanzahl     = 1;
                      Freigeber.Selected                    = false;
                      Freigeber.UrlaubanfrageReminderSended = false;

                      this.Freigeberliste.push(Freigeber);
                    }
                    else {

                      Mitarbeiter.Freigabenanfragenanzahl++;
                    }
                  }
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

  FreigberCheckedChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      this.Freigeberliste[event.index].Selected = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'FreigberCheckedChanged', this.Debug.Typen.Page);
    }
  }

  VertreterCheckedChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      this.Vertreterliste[event.index].Selected = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'VertreterCheckedChanged', this.Debug.Typen.Page);
    }
  }

  async SendUrlaubReminderMail() {

    try {

      for(let Vertreter of this.Vertreterliste) {

        if(Vertreter.Selected) {

          await this.DBUrlaub.SendVertreterreminder(Vertreter);

          Vertreter.UrlaubanfrageReminderSended = true;
          Vertreter.Selected                    = false;
        }
      }

      for(let Freigeber of this.Freigeberliste) {

        if(Freigeber.Selected) {

          await this.DBUrlaub.SendFreigabereminder(Freigeber);

          Freigeber.UrlaubanfrageReminderSended = true;
          Freigeber.Selected                    = false;
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Einstellungen', 'SendUrlaubReminderMail', this.Debug.Typen.Page);
    }
  }
}
