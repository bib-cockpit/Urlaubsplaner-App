import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MenueService} from "../../services/menue/menue.service";
import {DebugProvider} from "../../services/debug/debug";
import {BasicsProvider} from "../../services/basics/basics";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import * as lodash from "lodash-es";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import moment, {Moment} from "moment/moment";
import {DatabaseUrlaubService} from "../../services/database-urlaub/database-urlaub.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Mitarbeitersettingsstruktur} from "../../dataclasses/mitarbeitersettingsstruktur";
import {Subscription} from "rxjs";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";
import {ConstProvider} from "../../services/const/const";
import {AuswahlDialogService} from "../../services/auswahl-dialog/auswahl-dialog.service";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {backspace, languageSharp} from "ionicons/icons";
import {Urlauzeitspannenstruktur} from "../../dataclasses/urlauzeitspannenstruktur";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {Urlaubsstruktur} from "../../dataclasses/urlaubsstruktur";
import {cloneDeep} from "lodash-es";
import {Ferienstruktur} from "../../dataclasses/ferienstruktur";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {Feiertagestruktur} from "../../dataclasses/feiertagestruktur";
import {Urlaubprojektbeteiligtestruktur} from "../../dataclasses/urlaubprojektbeteiligtestruktur";

@Component({
  selector: 'common-urlaub-freigaben-page',
  templateUrl: 'common-urlaub-freigaben.page.html',
  styleUrls: ['common-urlaub-freigaben.page.scss'],
})
export class CommonUrlaubFreigabenPage implements OnInit, OnDestroy {

  @ViewChild('PageHeader', {static: false}) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', {static: false}) PageFooter: PageFooterComponent;

  public Auswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public ShowAuswahl: boolean;
  public Auswahlhoehe: number;

  private Auswahldialogorigin: string;
  private DataSubscription: Subscription;
  public ShowMitarbeiterauswahl: boolean;
  public AuswahlIDliste: string[];
  public MitarbeiterauswahlTitel: string;
  public MitarbeiterMultiselect: boolean;

  constructor(public Menuservice: MenueService,
              public Basics: BasicsProvider,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public Pool: DatabasePoolService,
              public DB: DatabaseUrlaubService,
              private DBMitarbeiter: DatabaseMitarbeiterService,
              public Const: ConstProvider,
              public DBStandort: DatabaseStandorteService,
              public DBMitarbeiterstettings: DatabaseMitarbeitersettingsService,
              public Auswahlservice: AuswahlDialogService,
              public Debug: DebugProvider) {
    try {

      this.Auswahlliste = [{Index: 0, FirstColumn: '', SecoundColumn: '', Data: null}];
      this.Auswahlindex = 0;
      this.Auswahltitel = '';
      this.DataSubscription = null;
      this.Auswahldialogorigin = this.Const.NONE;
      this.ShowMitarbeiterauswahl = false;
      this.AuswahlIDliste = [];
      this.MitarbeiterauswahlTitel = '';
      this.MitarbeiterMultiselect = true;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaub Freigaben Page', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.DataSubscription = this.Pool.LoadingAllDataFinished.subscribe(() => {

        this.PrepareData();
      });

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'OnInit', this.Debug.Typen.Page);
    }
  }


  private async PrepareData() {

    try {

      this.DB.Init();
      this.DB.CheckSetup();
      this.DB.SetPlanungsmonate();

      await this.DB.GetAnfragenlisten();



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'PrepareData', this.Debug.Typen.Page);
    }
  }

  GetDatumlangtext(Startstempel: number): string {

    try {

      return moment(Startstempel).locale('de').format('DD. MMMM YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'GetDatumlangtext', this.Debug.Typen.Page);
    }
  }

  MitarbeiterauswahlOkButtonClicked(idliste: string[]) {

    try {

      let Urlaub: Urlaubsstruktur;
      let Eintrag: Urlaubprojektbeteiligtestruktur;

      switch (this.Auswahldialogorigin) {


      }

      this.ShowMitarbeiterauswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaub Freigaben Page', 'MitarbeiterauswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  MitarebiterStandortfilterClickedHandler() {

    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.UrlaubEinstellungen_Standort_Filter;

      let Index = 0;

      this.ShowAuswahl = true;
      this.Auswahltitel = 'Standort festlegen';
      this.Auswahlliste = [];

      this.Auswahlliste.push({Index: Index, FirstColumn: 'kein Filter', SecoundColumn: '', Data: null});
      Index++;

      for (let Eintrag of this.Pool.Standorteliste) {

        this.Auswahlliste.push({
          Index: Index,
          FirstColumn: Eintrag.Kuerzel,
          SecoundColumn: Eintrag.Standort,
          Data: Eintrag
        });
        Index++;
      }

      if (this.DBStandort.CurrentStandortfilter !== null) {

        this.Auswahlindex = lodash.findIndex(this.Pool.Standorteliste, {_id: this.DBStandort.CurrentStandortfilter._id});
      } else this.Auswahlindex = 0;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaub Freigaben Page', 'MitarebiterStandortfilterClickedHandler', this.Debug.Typen.Page);
    }
  }

  async AuswahlOkButtonClicked(data: any) {

    try {

      let Urlaub: Urlaubsstruktur;

      switch (this.Auswahldialogorigin) {


      }

      this.ShowAuswahl = false;

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaub Freigaben Page', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  MitarbeiterAuswahlClicked() {

    try {

      this.Auswahldialogorigin     = this.Auswahlservice.Auswahloriginvarianten.UrlaubEinstellungen_Projektbeteiligte_Auswahl;
      this.MitarbeiterauswahlTitel = 'Mitarbeiter/innen auswählen';
      this.ShowMitarbeiterauswahl  = true;
      this.AuswahlIDliste          = [];
      this.MitarbeiterMultiselect  = true;

      for(let eintrag of this.DB.CurrentUrlaub.Projektbeteiligteliste) {

        this.AuswahlIDliste.push(eintrag.MitarbeiterID);
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'MitarbeiterWechselnClicked', this.Debug.Typen.Page);
    }
  }


  GetDatum(stempel: number) {

    try {

      return moment(stempel).format('DD.MM.YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'GetDatum', this.Debug.Typen.Page);
    }

  }


  VerteretungStatusChangedHandler(event: any, Zeitspanne: Urlauzeitspannenstruktur, _id: string) {

    try {

      Zeitspanne.Status = event.detail.value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'VerteretungStatusChangedHandler', this.Debug.Typen.Page);
    }
  }

  FreigabeStatusChangedHandler(event: any, Zeitspanne: Urlauzeitspannenstruktur, _id: string) {

    try {

      Zeitspanne.Status = event.detail.value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'FreigabeStatusChangedHandler', this.Debug.Typen.Page);
    }
  }

  CheckVertretungUpdateButtonEnabled(Mitareiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur): boolean {

    try {

      let Available: boolean = false;

      for(let Zeitspanne of Urlaub.Zeitspannen) {

        if(lodash.isUndefined(Zeitspanne.VertreterantwortSended)) Zeitspanne.VertreterantwortSended = false;

        if(Urlaub.FreigeberID !== null &&
           Zeitspanne.VertreterantwortSended === false &&
           Zeitspanne.VertreterID            === this.Pool.Mitarbeiterdaten._id &&
          (Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Vertreterablehnung || Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Vertreterfreigabe)) Available = true;
      }

      return Available;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'CheckVertretungUpdateButtonEnabled', this.Debug.Typen.Page);
    }
  }

  CheckFreigabeUpdateButtonEnabled(Mitareiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur): boolean {

    try {

      let Available: boolean = false;

      for(let Zeitspanne of Urlaub.Zeitspannen) {

        if(lodash.isUndefined(Zeitspanne.FreigabeantwortSended)) Zeitspanne.FreigabeantwortSended = false;

        if(Urlaub.FreigeberID               !== null &&
           Zeitspanne.FreigabeantwortSended === false &&
          (Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Genehmigt || Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Abgelehnt)) Available = true;
      }

      return Available;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'CheckFreigabeUpdateButtonEnabled', this.Debug.Typen.Page);
    }
  }

  CheckVertretungUpdateButtonVisible(Mitareiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur): boolean {

    try {

      let Visible: boolean = false;

      for(let Zeitspanne of Urlaub.Zeitspannen) {

        if(lodash.isUndefined(Zeitspanne.VertreterantwortSended)) Zeitspanne.VertreterantwortSended = false;

        if(Zeitspanne.VertreterantwortSended === false && Zeitspanne.VertreterID === this.Pool.Mitarbeiterdaten._id) Visible = true;
      }

      return Visible;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'CheckVertretungUpdateButtonVisible', this.Debug.Typen.Page);
    }
  }

  CheckFreigabeUpdateButtonVisible(Mitareiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur): boolean {

    try {

      let Visible: boolean = false;

      for(let Zeitspanne of Urlaub.Zeitspannen) {

        if(lodash.isUndefined(Zeitspanne.FreigabeantwortSended)) Zeitspanne.FreigabeantwortSended = false;

        if(Zeitspanne.FreigabeantwortSended === false &&
          Urlaub.FreigeberID                !== null  &&
          (Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Genehmigt || Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Abgelehnt)) Visible = true;
      }

      return Visible;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'CheckFreigabeUpdateButtonVisible', this.Debug.Typen.Page);
    }
  }

  async SendVertretungUpdate(Mitarbeiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur) {

    try {

      let Gesamtanzahl: number = 1;
      let Heute: Moment = moment();
      let Freigebender: Mitarbeiterstruktur;

      for(let Zeitspanne of Urlaub.Zeitspannen) {

        if(Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Vertreterablehnung)  Gesamtanzahl += 1;
        if(Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Vertreterfreigabe)   Gesamtanzahl += 2;
      }

      for(let Zeitspanne of Urlaub.Zeitspannen) {

        if(Zeitspanne.Status !== this.DB.Urlaubstatusvarianten.Vertreteranfrage) {

          if(Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Vertreterfreigabe) {

            await this.DB.SendVertreterantworten(Mitarbeiter, Urlaub);

            Zeitspanne.Statusmeldung += '<br>' + Heute.format('DD.MM.YYYY') + ' Vertretungszusage wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.';

            Freigebender = lodash.find(this.Pool.Mitarbeiterliste, {_id: Urlaub.FreigeberID});

            await this.DB.SendFreigabeanfrage(Mitarbeiter, Urlaub, Freigebender);

            Zeitspanne.Statusmeldung += '<br>' + Heute.format('DD.MM.YYYY') + ' Urlaubsfreigabe Anfrage wurde an ' + Freigebender.Vorname + ' ' + Freigebender.Name + ' gesendet.';
          }

          if(Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Vertreterablehnung) {

            await this.DB.SendVertreterantworten(Mitarbeiter, Urlaub);

            Zeitspanne.Statusmeldung += '<br>' + Heute.format('DD.MM.YYYY') + ' Vertretungsabsage wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.';
          }
        }
      }

      let Urlaubindex = lodash.findIndex(Mitarbeiter.Urlaubsliste, { Jahr: this.DB.Jahr });

      Mitarbeiter.Urlaubsliste[Urlaubindex] = Urlaub;

      await this.DBMitarbeiter.UpdateMitarbeiter(Mitarbeiter);
      await this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'SendVertretungUpdate', this.Debug.Typen.Page);
    }
  }

  async SendFreigabeUpdate(Mitarbeiter: Mitarbeiterstruktur, Urlaub: Urlaubsstruktur) {

    try {

      let Gesamtanzahl: number = 1;
      let Heute: Moment = moment();
      let Freigebender: Mitarbeiterstruktur;
      let Vertretung: Mitarbeiterstruktur;

      for(let Zeitspanne of Urlaub.Zeitspannen) {

        if(Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Genehmigt && Zeitspanne.FreigabeantwortSended === false)  Gesamtanzahl += 1;
        if(Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Abgelehnt && Zeitspanne.FreigabeantwortSended === false)  Gesamtanzahl += 2;
      }

      for(let Zeitspanne of Urlaub.Zeitspannen) {

        if(Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Genehmigt || Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Abgelehnt) {

          Freigebender = lodash.find(this.Pool.Mitarbeiterliste, { _id: Urlaub.FreigeberID });
          Vertretung   = lodash.find(this.Pool.Mitarbeiterliste, { _id: Zeitspanne.VertreterID });

          if(Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Genehmigt) {

            await this.DB.SendMitarbeiterFreigabezusage(Mitarbeiter, Urlaub, Freigebender);
            await this.DB.SendOfficeFreigabezusage(Mitarbeiter, Urlaub, Vertretung, Freigebender);


            Zeitspanne.Statusmeldung += '<br>' + Heute.format('DD.MM.YYYY') + ' Urlaubsfreigabe wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.';
            Zeitspanne.Statusmeldung += '<br>' + Heute.format('DD.MM.YYYY') + ' Urlaubsfreigabe wurde an das Office gesendet.';
          }

          if(Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Abgelehnt) {

            await this.DB.SendMitarbeiterFreigabeablehnung(Mitarbeiter, Urlaub, Freigebender);

            Zeitspanne.Statusmeldung += '<br>' + Heute.format('DD.MM.YYYY') + ' Urlaubsablehnung wurde an ' + Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name + ' gesendet.';
          }
        }
      }

      let Urlaubindex = lodash.findIndex(Mitarbeiter.Urlaubsliste, { Jahr: this.DB.Jahr });

      Mitarbeiter.Urlaubsliste[Urlaubindex] = Urlaub;

      await this.DBMitarbeiter.UpdateMitarbeiter(Mitarbeiter);
      await this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaub Freigaben Page', 'SendFreigabeUpdate', this.Debug.Typen.Page);
    }
  }
}
