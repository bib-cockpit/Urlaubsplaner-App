import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MenueService} from "../../services/menue/menue.service";
import {DebugProvider} from "../../services/debug/debug";
import {BasicsProvider} from "../../services/basics/basics";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import * as lodash from "lodash-es";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import moment, {Moment} from "moment/moment";
import {DatabaseUrlaubService} from "../../services/database-urlaub/database-urlaub.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
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
import {Urlaubprojektbeteiligtestruktur} from "../../dataclasses/urlaubprojektbeteiligtestruktur";
import {ToolsProvider} from "../../services/tools/tools";
import {cloneDeep} from "lodash-es";
import {Homeofficezeitspannenstruktur} from "../../dataclasses/homeofficezeitspannenstruktur";
import {Standortestruktur} from "../../dataclasses/standortestruktur";

@Component({
  selector: 'common-urlaub-planung-page',
  templateUrl: 'common-urlaub-planung.page.html',
  styleUrls: ['common-urlaub-planung.page.scss'],
})
export class CommonUrlaubPlanungPage implements OnInit, OnDestroy {

  @ViewChild('PageHeader', { static: false }) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', { static: false }) PageFooter: PageFooterComponent;

  public Monateliste_Uebersicht: string[][];
  public Monateliste_Mounseover: boolean[];
  public Auswahlliste: Auswahldialogstruktur[];
  public BundeslandAuswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public ShowAuswahl: boolean;
  public Auswahlhoehe: number;

  public Message: string;
  public ShowMitarbeitereditor: boolean;
  public AddUrlaubRunning: boolean;
  public AddHomeofficeRunning: boolean;
  private Auswahldialogorigin: string;
  private DataSubscription: Subscription;
  public ShowMitarbeiterauswahl: boolean;
  public AuswahlIDliste: string[];
  public MitarbeiterauswahlTitel: string;
  public LegendeVisible: boolean;
  public Legendehoehe: number;
  public Legendebreite: number;
  public Flagsource: string;

  constructor(public Menuservice: MenueService,
              public Basics: BasicsProvider,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public Pool: DatabasePoolService,
              public DB: DatabaseUrlaubService,
              private DBMitarbeiter: DatabaseMitarbeiterService,
              public Const: ConstProvider,
              public DBStandort: DatabaseStandorteService,
              public Auswahlservice: AuswahlDialogService,
              public Tools: ToolsProvider,
              public Debug: DebugProvider) {
    try {

      this.Monateliste_Uebersicht = [];
      this.Monateliste_Uebersicht.push(['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni']);
      this.Monateliste_Uebersicht.push(['Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']);

      this.Monateliste_Mounseover = [false, false, false, false, false, false, false, false, false, false, false, false ];

      this.Auswahlliste          = [{ Index: 0, FirstColumn: '', SecoundColumn: '', Data: null}];
      this.Auswahlindex          = 0;
      this.Auswahltitel          = '';
      this.DataSubscription      = null;
      this.Message               = '';
      this.ShowMitarbeitereditor = false;
      this.Auswahldialogorigin   = this.Const.NONE;
      this.AddUrlaubRunning      = false;
      this.AddHomeofficeRunning  = false;
      this.ShowMitarbeiterauswahl = false;
      this.AuswahlIDliste         = [];
      this.MitarbeiterauswahlTitel = '';
      this.LegendeVisible          = false;
      this.Legendehoehe            = 0;
      this.Legendebreite           = 0;
      this.Flagsource              = '';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

      this.DataSubscription.unsubscribe();
      this.DataSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  public ionViewDidEnter() {

    try {

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.Legendebreite = 400;
      this.Legendehoehe  = this.Basics.InnerContenthoehe;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaub Einstellungen Page', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

      this.DataSubscription = this.Pool.LoadingAllDataFinished.subscribe(() => {

        this.PrepareData();
      });

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'OnInit', this.Debug.Typen.Page);
    }
  }

  async AuswahlOkButtonClicked(data: any) {

    try {

      let Zeitspanne: Urlauzeitspannenstruktur;
      let Urlaubindex: number;
      let Heute: Moment = moment().locale('de');

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Urlaubsliste_Bundesland:

          this.DB.Bundeslandkuerzel = data;

          let landcode = this.DB.Bundeslandkuerzel.substring(0, 2);

          this.DB.ReadFeiertage(landcode).then(() => {

            this.ShowAuswahl = false;

            this.PrepareData();
          });

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Urlaubsplanung_Status_Aendern:

          if(data !== null && data !== this.DB.CurrentUrlaubzeitspanne.Status) {

            debugger;

            Zeitspanne = lodash.find(this.DB.CurrentUrlaub.Urlaubzeitspannen, {ZeitspannenID: this.DB.CurrentUrlaubzeitspanne.ZeitspannenID});

            Zeitspanne.Status                     = data;

            switch (Zeitspanne.Status) {

              case this.DB.Urlaubstatusvarianten.Geplant:

                Zeitspanne.VertreteranfrageSended      = false;
                Zeitspanne.VertreterantwortSended      = false;
                Zeitspanne.FreigabeanfrageSended       = false;
                Zeitspanne.FreigabeantwortSended       = false;
                Zeitspanne.FreigabeantwortOfficeSended = false;

                Zeitspanne.Vertretunganfragezeitstempel     = null;
                Zeitspanne.Vertretungantwortzeitstempel     = null;
                Zeitspanne.Vertretungantwortzeitstempel     = null;
                Zeitspanne.Freigabeantwortzeitstempel       = null;
                Zeitspanne.FreigabeantwortOfficezeitstempel = null;



                break;

              case this.DB.Urlaubstatusvarianten.Vertreteranfrage:

                break;

              case this.DB.Urlaubstatusvarianten.Vertreterfreigabe:

                break;

              case this.DB.Urlaubstatusvarianten.Vertreterablehnung:

                break;

              case this.DB.Urlaubstatusvarianten.Abgelehnt:

                break;

              case this.DB.Urlaubstatusvarianten.Genehmigt:

                break;
            }


            Urlaubindex = lodash.findIndex(this.DB.CurrentMitarbeiter.Urlaubsliste, { Jahr: this.DB.Jahr });

            this.DB.CurrentMitarbeiter.Urlaubsliste[Urlaubindex] = this.DB.CurrentUrlaub;

            await this.DBMitarbeiter.UpdateMitarbeiterUrlaub(this.DB.CurrentMitarbeiter).then(() => {

              this.ShowAuswahl = false;
            });

          }




          break;

        case this.Auswahlservice.Auswahloriginvarianten.UrlaubPlanung_Standort_Filter:

          this.DBStandort.CurrentStandortfilter        = cloneDeep(data);
          this.Pool.Mitarbeitersettings.StandortFilter = data !== null ? data._id : this.Const.NONE;

          this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings, null).then(() => {

            this.ShowAuswahl = false;

            this.DBStandort.StandortfilterChanged.emit();
          });

          break;

        case  this.Auswahlservice.Auswahloriginvarianten.Urlaubsplanung_Vertreter_Festlegen:

          Zeitspanne = lodash.find(this.DB.CurrentUrlaub.Urlaubzeitspannen, {ZeitspannenID: this.DB.CurrentUrlaubzeitspanne.ZeitspannenID});

          this.DB.CurrentUrlaubzeitspanne.VertreterID = data;
          Zeitspanne.VertreterID                = data;
          Zeitspanne.Status                     = this.DB.Urlaubstatusvarianten.Geplant;
          Zeitspanne.FreigabeantwortSended      = false;
          Zeitspanne.FreigabeanfrageSended      = false;
          Zeitspanne.VertreterantwortSended     = false;

          Urlaubindex = lodash.findIndex(this.DB.CurrentMitarbeiter.Urlaubsliste, { Jahr: this.DB.Jahr });

          this.DB.CurrentMitarbeiter.Urlaubsliste[Urlaubindex] = this.DB.CurrentUrlaub;

          await this.DBMitarbeiter.UpdateMitarbeiterUrlaub(this.DB.CurrentMitarbeiter).then(() => {

            this.ShowAuswahl = false;
          });

          break;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  BundeslandClickedHandler() {

    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Urlaubsliste_Bundesland;

      this.Auswahltitel        = 'Bundesland';
      this.Auswahlhoehe        = 600;
      this.Auswahlliste        = this.BundeslandAuswahlliste;
      this.Auswahlindex        = lodash.findIndex(this.Auswahlliste, {Data:this.DB.Bundeslandkuerzel} );
      this.ShowAuswahl         = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'FortschrittClickedHandler', this.Debug.Typen.Page);
    }
  }



  private async PrepareData() {

    try {

      let Index: number = 0;

      this.DB.Init();
      this.DB.CheckSetup();
      this.DB.SetPlanungsmonate();
      this.DB.CountAnfragenanzahlen();

      this.BundeslandAuswahlliste  = [];

      for(let Region of this.DB.Regionenliste) {

        this.BundeslandAuswahlliste.push({ Index: Index, FirstColumn: Region.Name, SecoundColumn: Region.isoCode, Data: Region.isoCode });

        Index++;
      }

      this.DB.Bundesland = lodash.find(this.BundeslandAuswahlliste, {Data: this.DB.Bundeslandkuerzel}).FirstColumn;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'PrepareData', this.Debug.Typen.Page);
    }
  }

  FeiertagCrossedEventHandler(Daten: {Name: string; Laendercode: string}) {

    try {

      this.Message = Daten.Name;

      if(Daten.Laendercode !== '') {

        this.Flagsource  = 'assets/images/';
        this.Flagsource += Daten.Laendercode === 'DE' ? 'de.png' : 'bg.png';
      }
      else {

        this.Flagsource = '';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'FeiertagCrossedEventHandler', this.Debug.Typen.Page);
    }
  }

  FerientagCrossedEventHandler(Daten: {Name: string; Laendercode: string}) {

    try {

      this.Message = Daten.Name;

      if(Daten.Laendercode !== '') {

        this.Flagsource  = 'assets/images/';
        this.Flagsource += Daten.Laendercode === 'DE' ? 'de.png' : 'bg.png';
      }
      else {

        this.Flagsource = '';
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'FerientagCrossedEventHandler', this.Debug.Typen.Page);
    }
  }

  GetDatum(Anfangstempel: number) {

    return moment(Anfangstempel).format('DD.MM.YYYY');
  }

  AnsichtFerientageCheckChanged(event: { status: boolean; index: number; event: any; value: string }, landcode: string) {

    try {

      switch (landcode) {

        case 'DE':

          this.Pool.Mitarbeitersettings.UrlaubShowFerien_DE = event.status;
          this.DB.ShowFerientage_DE = event.status;

          break;

        case 'BG':

          this.Pool.Mitarbeitersettings.UrlaubShowFerien_BG = event.status;
          this.DB.ShowFerientage_BG = event.status;

          break;
      }

      this.DBMitarbeitersettings.SaveMitarbeitersettings().then(() => {

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'AnsichtFerientageCheckChanged', this.Debug.Typen.Page);
    }
  }

  AnsichtFeiertageCheckChanged(event: { status: boolean; index: number; event: any; value: string }, landcode: string) {

    try {

      switch (landcode) {

        case 'DE':

          this.Pool.Mitarbeitersettings.UrlaubShowFeiertage_DE = event.status;
          this.DB.ShowFeiertage_DE = event.status;

          break;

        case 'BG':

          this.Pool.Mitarbeitersettings.UrlaubShowFeiertage_BG = event.status;
          this.DB.ShowFeiertage_BG = event.status;

          break;
      }

      this.DBMitarbeitersettings.SaveMitarbeitersettings().then(() => {

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'AnsichtFeiertageCheckChanged', this.Debug.Typen.Page);
    }
  }


  GetMonatButtonColor(Monatindex: number): string {

    try {

      if(this.DB.CurrentMonatindex === Monatindex) return 'orange';

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'GetMonatButtonColor', this.Debug.Typen.Page);
    }
  }

  MonatButtonClicked(Monatindex: number) {

    try {

      this.DB.CurrentMonatindex = Monatindex;
      this.DB.SetPlanungsmonate();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'MonatButtonClicked', this.Debug.Typen.Page);
    }
  }

  MonatBackButtonClicked() {

    try {

      if(this.DB.CurrentMonatindex > 0) {

        this.DB.CurrentMonatindex--;

        this.DB.SetPlanungsmonate();

      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'MonatBackButtonClicked', this.Debug.Typen.Page);
    }
  }

  MonatForwardButtonClicked() {

    try {

      if(this.DB.CurrentMonatindex < 11) {

        this.DB.CurrentMonatindex++;

        this.DB.SetPlanungsmonate();

      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'MonatForwardButtonClicked', this.Debug.Typen.Page);
    }
  }

  AddUrlaub() {

    try {

      this.DB.CurrentUrlaubzeitspanne = null;
      this.AddUrlaubRunning           = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'AddUrlaub', this.Debug.Typen.Page);
    }
  }

  AddHomeofficeStart() {

    try {

      this.DB.CurrentHomeofficezeitspanne = null;
      this.AddHomeofficeRunning           = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'AddHomeofficeStart', this.Debug.Typen.Page);
    }
  }

  AddUrlaubFinishedHandler() {

    try {

      this.AddUrlaubRunning = false;

      if(this.DB.CurrentUrlaubzeitspanne !== null) {

        this.DB.CurrentUrlaub.Urlaubzeitspannen.push(this.DB.CurrentUrlaubzeitspanne);

        let Urlaubindex = lodash.findIndex(this.DB.CurrentMitarbeiter.Urlaubsliste, { Jahr: this.DB.Jahr });

        this.DB.CurrentMitarbeiter.Urlaubsliste[Urlaubindex] = this.DB.CurrentUrlaub;

        this.DBMitarbeiter.UpdateMitarbeiterUrlaub(this.DB.CurrentMitarbeiter).then(() => {

          // debugger;
          // this.DB.CurrentUrlaubzeitspanne = null;
        });
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'AddUrlaubFinishedHandler', this.Debug.Typen.Page);
    }
  }

  UrlaubLoeschen(Zeitspanne: Urlauzeitspannenstruktur) {

    try {


      let Zeitspannen = lodash.filter(this.DB.CurrentUrlaub.Urlaubzeitspannen, (eintrag: Urlauzeitspannenstruktur) => {

        return eintrag.ZeitspannenID !== Zeitspanne.ZeitspannenID;
      });

      this.DB.CurrentUrlaub                   = lodash.find(this.DB.CurrentMitarbeiter.Urlaubsliste, {Jahr: this.DB.Jahr});
      this.DB.CurrentUrlaub.Urlaubzeitspannen = Zeitspannen;

      let Urlaubindex = lodash.findIndex(this.DB.CurrentMitarbeiter.Urlaubsliste, { Jahr: this.DB.Jahr });

      this.DB.CurrentMitarbeiter.Urlaubsliste[Urlaubindex] = this.DB.CurrentUrlaub;

      this.DBMitarbeiter.UpdateMitarbeiterUrlaub(this.DB.CurrentMitarbeiter).then(() => {

        this.DB.PlanungsmonateChanged.emit();
      });


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'UrlaubLoeschen', this.Debug.Typen.Page);
    }
  }

  AnsichtCheckChanged(event: { status: boolean; index: number; event: any; value: string }, origin: string) {

    try {

      switch (origin) {

        case this.DB.Urlaubstatusvarianten.Geplant:

          this.Pool.Mitarbeitersettings.UrlaubShowBeantragt = event.status;

        break;

        case this.DB.Urlaubstatusvarianten.Vertreterfreigabe:

          this.Pool.Mitarbeitersettings.UrlaubShowVertreterfreigabe = event.status;

        break;

        case this.DB.Urlaubstatusvarianten.Genehmigt:

          this.Pool.Mitarbeitersettings.UrlaubShowGenehmigt = event.status;

        break;

        case this.DB.Urlaubstatusvarianten.Abgelehnt:

          this.Pool.Mitarbeitersettings.UrlaubShowAbgelehnt = event.status;

        break;
      }

      this.DBMitarbeitersettings.SaveMitarbeitersettings().then(() => {

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'AnsichtCheckChanged', this.Debug.Typen.Page);
    }
  }

  UrlaubSuchen(Zeitspanne: Urlauzeitspannenstruktur) {

    try {

      let Datum: Moment = moment(Zeitspanne.Startstempel);

      this.DB.CurrentMonatindex = Datum.month();
      this.DB.SetPlanungsmonate();


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'UrlaubSuchen', this.Debug.Typen.Page);
    }
  }

  GetDatumlangtext(Startstempel: number): string {

    try {

      return moment(Startstempel).locale('de').format('DD. MMMM YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'GetDatumlangtext', this.Debug.Typen.Page);
    }
  }

  MitarbeiterauswahlOkButtonClicked(idliste: string[]) {

    try {

      let Mitarbeiter: Mitarbeiterstruktur;

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Urlaubsplanung_Mitarbeiter_Wechseln:

          Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: idliste[0]});

          this.DB.CurrentMitarbeiter = Mitarbeiter;

          debugger;

          this.PrepareData();

          this.DB.PlanungsmonateChanged.emit();

          break;

      }

      this.ShowMitarbeiterauswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'MitarbeiterauswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  MitarebiterStandortfilterClickedHandler() {

    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.UrlaubPlanung_Standort_Filter;

      let Index = 0;

      this.ShowAuswahl         = true;
      this.Auswahltitel        = 'Standort festlegen';
      this.Auswahlliste        = [];

      this.Auswahlliste.push({ Index: Index, FirstColumn: 'kein Filter', SecoundColumn: '', Data: null });
      Index++;

      for(let Eintrag of this.Pool.Standorteliste) {

        this.Auswahlliste.push({ Index: Index, FirstColumn: Eintrag.Kuerzel, SecoundColumn: Eintrag.Standort, Data: Eintrag });
        Index++;
      }

      if(this.DBStandort.CurrentStandortfilter !== null) {

        this.Auswahlindex = lodash.findIndex(this.Pool.Standorteliste, {_id: this.DBStandort.CurrentStandortfilter._id});
      }
      else this.Auswahlindex = 0;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Urlaubsplanung Page', 'MitarebiterStandortfilterClickedHandler', this.Debug.Typen.Page);
    }
  }

  MitarbeiterWechselnClicked() {

    try {

      this.Auswahldialogorigin    = this.Auswahlservice.Auswahloriginvarianten.Urlaubsplanung_Mitarbeiter_Wechseln;
      this.ShowMitarbeiterauswahl = true;
      this.AuswahlIDliste         = [];


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'MitarbeiterWechselnClicked', this.Debug.Typen.Page);
    }
  }

  StellvertreterFestlegenClicked(Zeitspanne: Urlauzeitspannenstruktur) {

    try {

      let Mitarbeiter: Mitarbeiterstruktur;
      let Index: number;

      this.DB.CurrentUrlaubzeitspanne = Zeitspanne;

      Index = 0;

      this.Auswahlliste = [];

      for(let Eintrag of this.DB.CurrentUrlaub.Projektbeteiligteliste) {

        Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: Eintrag.MitarbeiterID});

        if(!lodash.isUndefined(Mitarbeiter)) {

          this.Auswahlliste.push({ Index: Index, FirstColumn: Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name, SecoundColumn: '', Data: Mitarbeiter._id });

          Index++;
        }
      }

      this.Auswahltitel            = 'Stellvertreter/in festlegen';
      this.Auswahldialogorigin     = this.Auswahlservice.Auswahloriginvarianten.Urlaubsplanung_Vertreter_Festlegen;
      this.ShowAuswahl             = true;
      this.Auswahlindex            = lodash.findIndex(this.DB.CurrentUrlaub.Projektbeteiligteliste, {MitarbeiterID: Zeitspanne.VertreterID});

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'StellvertreterFestlegenClicked', this.Debug.Typen.Page);
    }
  }

  GetStellvertretername(Zeitspanne: Urlauzeitspannenstruktur): string{

    try {

      let Mitarbeiter: Mitarbeiterstruktur = lodash.find(this.Pool.Mitarbeiterliste, {_id: Zeitspanne.VertreterID});

      if(lodash.isUndefined(Mitarbeiter)) return 'unbekannt';
      else return Mitarbeiter.Vorname + ' ' + Mitarbeiter.Name;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'GetStellvertretername', this.Debug.Typen.Page);
    }
  }

  DisplayExternCheckChanged(event: { status: boolean; index: number; event: any; value: string }, Urlaub: Urlaubsstruktur, i: number) {

    try {

      let Beteiligt: Urlaubprojektbeteiligtestruktur = lodash.find(this.DB.CurrentUrlaub.Projektbeteiligteliste, {MitarbeiterID: Urlaub.MitarbeiterIDExtern});

      if(!lodash.isUndefined(Beteiligt)) Beteiligt.Display = event.status;

      debugger;

      let Urlaubindex = lodash.findIndex(this.DB.CurrentMitarbeiter.Urlaubsliste, { Jahr: this.DB.Jahr });

      this.DB.CurrentMitarbeiter.Urlaubsliste[Urlaubindex] = this.DB.CurrentUrlaub;

      this.DBMitarbeiter.UpdateMitarbeiterUrlaub(this.DB.CurrentMitarbeiter).then(() => {

        this.DB.ExterneUrlaubeChanged.emit();
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'DisplayExternCheckChanged', this.Debug.Typen.Page);
    }
  }


  CheckUrlaubUpdatesAvailable(): boolean {

    try {

      let Available: boolean = false;

      if(this.DB.CurrentUrlaub !== null) {

        for(let Zeitspanne of this.DB.CurrentUrlaub.Urlaubzeitspannen) {

          if(Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Geplant && Zeitspanne.VertreterID !== null) Available = true;
        }
      }

      return Available;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'CheckUrlaubUpdatesAvailable', this.Debug.Typen.Page);
    }
  }

  CheckHomeofficeUpdatesAvailable(): boolean {

    try {

      let Available: boolean = false;
      let Standort: Standortestruktur = lodash.find(this.Pool.Standorteliste, {_id: this.DB.CurrentMitarbeiter.StandortID});

      if(this.DB.CurrentUrlaub !== null) {

        for(let Zeitspanne of this.DB.CurrentUrlaub.Homeofficezeitspannen) {

          if(Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Geplant && Standort.Homeofficefreigabepersonen.length > 0) Available = true;
        }
      }

      return Available;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'CheckHomeofficeUpdatesAvailable', this.Debug.Typen.Page);
    }
  }

  CheckLoschenEnabled(Zeitspanne: Urlauzeitspannenstruktur): boolean {

    try {

      if(this.Pool.Mitarbeiterdaten !== null && this.Pool.Mitarbeiterdaten.Urlaubsfreigaben === true) {

        return true;
      }
      else {

        return Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Geplant ||
               Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Abgelehnt || Zeitspanne.Status === this.DB.Urlaubstatusvarianten.Vertreterablehnung;
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'CheckLoschenEnabled', this.Debug.Typen.Page);
    }
  }

  CancelDatumClicked() {

    try {

      this.AddUrlaubRunning     = false;
      this.DB.CurrentUrlaubzeitspanne = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'CancelDatumClicked', this.Debug.Typen.Page);
    }
  }

  StatusClickedHandler(Zeitspanne: Urlauzeitspannenstruktur) {

    try {

      let Index: number = 0;

      this.Auswahltitel         = 'Status ändern';
      this.Auswahldialogorigin  = this.Auswahlservice.Auswahloriginvarianten.Urlaubsplanung_Status_Aendern;
      this.DB.CurrentUrlaubzeitspanne = Zeitspanne;

      this.Auswahlliste = [];

      this.Auswahlliste.push({ Index: Index++, FirstColumn: this.DB.Urlaubstatusvarianten.Geplant, SecoundColumn:      '', Data: this.DB.Urlaubstatusvarianten.Geplant });
      this.Auswahlliste.push({ Index: Index++, FirstColumn: this.DB.Urlaubstatusvarianten.Vertreteranfrage, SecoundColumn:   '', Data: this.DB.Urlaubstatusvarianten.Vertreteranfrage });
      this.Auswahlliste.push({ Index: Index++, FirstColumn: this.DB.Urlaubstatusvarianten.Vertreterablehnung, SecoundColumn: '', Data: this.DB.Urlaubstatusvarianten.Vertreterablehnung });
      this.Auswahlliste.push({ Index: Index++, FirstColumn: this.DB.Urlaubstatusvarianten.Vertreterfreigabe, SecoundColumn:  '', Data: this.DB.Urlaubstatusvarianten.Vertreterfreigabe });
      this.Auswahlliste.push({ Index: Index++, FirstColumn: this.DB.Urlaubstatusvarianten.Abgelehnt, SecoundColumn:          '', Data: this.DB.Urlaubstatusvarianten.Abgelehnt });
      this.Auswahlliste.push({ Index: Index++, FirstColumn: this.DB.Urlaubstatusvarianten.Genehmigt, SecoundColumn:          '', Data: this.DB.Urlaubstatusvarianten.Genehmigt });

      this.ShowAuswahl  = true;
      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: Zeitspanne.Status});

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'StatusClickedHandler', this.Debug.Typen.Page);
    }
  }

  AddHomeoffice() {

    try {

      if(this.DB.CurrentHomeofficezeitspanne !== null) {

        this.DB.CurrentUrlaub.Homeofficezeitspannen.push(this.DB.CurrentHomeofficezeitspanne);

        let Urlaubindex = lodash.findIndex(this.DB.CurrentMitarbeiter.Urlaubsliste, { Jahr: this.DB.Jahr });

        this.DB.CurrentMitarbeiter.Urlaubsliste[Urlaubindex] = this.DB.CurrentUrlaub;

      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'AddHomeofficeFinished', this.Debug.Typen.Page);
    }
  }

  SaveHomeofficeEventHandler() {

    try {

      this.AddHomeofficeRunning           = false;
      this.DB.CurrentHomeofficezeitspanne = null;

      this.DBMitarbeiter.UpdateMitarbeiterUrlaub(this.DB.CurrentMitarbeiter).then(() => {


      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'SaveHomeofficeEventHandler', this.Debug.Typen.Page);
    }
  }

  GetHomeofficezeitspannenByStataus(Status: string): Homeofficezeitspannenstruktur[] {

    try {

      return lodash.filter(this.DB.CurrentUrlaub.Homeofficezeitspannen, {Status: Status});

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Urlaubsplanung Page', 'GetHomeofficezeitspannenByStataus', this.Debug.Typen.Page);
    }
  }
}
