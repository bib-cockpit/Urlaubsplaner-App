import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MenueService} from "../../services/menue/menue.service";
import {DebugProvider} from "../../services/debug/debug";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import {BasicsProvider} from "../../services/basics/basics";
import {AuswahlDialogService} from "../../services/auswahl-dialog/auswahl-dialog.service";
import {DatabaseProtokolleService} from "../../services/database-protokolle/database-protokolle.service";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Graphservice} from "../../services/graph/graph";
import {ConstProvider} from "../../services/const/const";
import * as lodash from "lodash-es";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Kostengruppenstruktur} from "../../dataclasses/kostengruppenstruktur";
import {Subscription} from "rxjs";
import {KostengruppenService} from "../../services/kostengruppen/kostengruppen.service";
import {LocalstorageService} from "../../services/localstorage/localstorage";
import {Protokollstruktur} from "../../dataclasses/protokollstruktur";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import {
  DatabaseMitarbeitersettingsService
} from "../../services/database-mitarbeitersettings/database-mitarbeitersettings.service";
import MyMoment from "moment";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {DatabaseFestlegungenService} from "../../services/database-festlegungen/database-festlegungen.service";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {Fachbereiche} from "../../dataclasses/fachbereicheclass";

@Component({
  selector: 'pj-festlegungsliste',
  templateUrl: 'pj-festlegungsliste.page.html',
  styleUrls: ['pj-festlegungsliste.page.scss'],
})
export class PjFestlegungslistePage implements OnInit, OnDestroy {

  @ViewChild('PageHeader', {static: false}) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', {static: false}) PageFooter: PageFooterComponent;

  private PunkteSubscription: Subscription;
  public ShowProtokollEditor: boolean;
  public DialogPosY: number;
  public Dialoghoehe: number;
  public Dialogbreite: number;
  public Auswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public ShowAuswahl: boolean;
  private Auswahldialogorigin: string;
  public Auswahlhoehe: number;
  public ShowProjektpunktEditor: boolean;
  public AuswahlIDliste: string[];
  public ShowMitarbeiterauswahl: boolean;
  public ShowBeteiligteauswahl: boolean;
  public ProjektSubscription: Subscription;
  public ShowProjektschnellauswahl: boolean;
  public ShowKostengruppenauswahl: boolean;
  public ShowRaumauswahl: boolean;
  public KostenDialogbreite: number;
  public KostenDialoghoehe: number;
  public StrukturDialogbreite: number;
  public StrukturDialoghoehe: number;
  public KostengruppenOrigin: string;
  public Kostengruppeauswahltitel: string;
  public Festlegungfiltertext: string;
  private ShowOpenFestlegungOnly: boolean;
  public EmailDialogbreite: number;
  public EmailDialoghoehe: number;
  public ShowEmailSenden: boolean;


  constructor(public Menuservice: MenueService,
              public Basics: BasicsProvider,
              public Auswahlservice: AuswahlDialogService,
              public DB: DatabaseFestlegungenService,
              public DBProjektpunkte: DatabaseProjektpunkteService,
              public DBProtokolle: DatabaseProtokolleService,
              public DBStandort: DatabaseStandorteService,
              public DBProjekte: DatabaseProjekteService,
              public GraphService: Graphservice,
              public Pool: DatabasePoolService,
              public Const: ConstProvider,
              public KostenService: KostengruppenService,
              private DBMitarbeitersettings: DatabaseMitarbeitersettingsService,
              public Debug: DebugProvider) {

    try {

      this.Auswahlliste        = [{ Index: 0, FirstColumn: '', SecoundColumn: '', Data: null}];
      this.Auswahlindex        = 0;
      this.Auswahltitel        = '';
      this.ShowAuswahl         = false;
      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Festlegungsliste_Editor_Leistungsphase;
      this.PunkteSubscription  = null;
      this.ShowProtokollEditor = false;
      this.Dialoghoehe         = 1000;
      this.Dialogbreite        = 900;
      this.DialogPosY          = 60;
      this.Auswahlhoehe        = 300;
      this.AuswahlIDliste      = [];
      this.KostenDialogbreite       = 1200;
      this.KostenDialoghoehe        = 500;
      this.StrukturDialogbreite     = 1260;
      this.StrukturDialoghoehe      = 800;
      this.Festlegungfiltertext     = '';
      this.ShowOpenFestlegungOnly   = false;

      this.ShowProjektpunktEditor    = false;
      this.ShowMitarbeiterauswahl    = false;
      this.ShowBeteiligteauswahl     = false;
      this.ShowProjektschnellauswahl = false;
      this.ShowKostengruppenauswahl  = false;
      this.ShowRaumauswahl           = false;
      this.EmailDialogbreite        = 800;
      this.EmailDialoghoehe         = 600;
      this.ShowEmailSenden          = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungen Liste', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

      this.PunkteSubscription.unsubscribe();
      this.PunkteSubscription = null;

      this.ProjektSubscription.unsubscribe();
      this.ProjektSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungliste', 'ngOnDestroy', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.ProjektSubscription = this.DBProjekte.CurrentFavoritenProjektChanged.subscribe(() => {

        this.PrepareData();
      });

      this.PunkteSubscription = this.Pool.ProjektpunktelisteChanged.subscribe(() => {

        this.PrepareData();
      });

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungliste', 'ngOnInit', this.Debug.Typen.Page);
    }
  }

  private PrepareData() {

    try {

      let Projektpunkteliste: Projektpunktestruktur[];
      let CurrentPunkt: Projektpunktestruktur;
      let Liste: Projektpunktestruktur[];
      let Merker: any;
      let Laenge: number;
      let TeilA: string;
      let TeilB: string;
      let TeilC: string;
      let Teillaenge: number;
      let PosA: number;
      let Solltext: string;
      let Suchtext: string;

      this.DB.Displayliste       = [];
      this.DB.Kostengruppenliste = [];

      if(this.DBProjekte.CurrentProjekt !== null && this.Pool.Mitarbeitersettings !== null) {

        Projektpunkteliste = lodash.filter(this.Pool.Projektpunkteliste[this.DBProjekte.CurrentProjekt.Projektkey], (punkt: Projektpunktestruktur) => {

          return punkt.Status === this.Const.Projektpunktstatustypen.Festlegung.Name;
        });

        if(this.Pool.Mitarbeitersettings.LeistungsphaseFilter !== null && this.Pool.Mitarbeitersettings.LeistungsphaseFilter !== this.Const.Leistungsphasenvarianten.UNBEKANNT) {

          Projektpunkteliste = lodash.filter(Projektpunkteliste, (punkt: Projektpunktestruktur) => {

            return punkt.Leistungsphase === this.Pool.Mitarbeitersettings.LeistungsphaseFilter;
          });
        }

        if(this.ShowOpenFestlegungOnly) {

          Projektpunkteliste = lodash.filter(Projektpunkteliste, (punkt: Projektpunktestruktur) => {

            return punkt.OpenFestlegung === true;
          });
        }

        Projektpunkteliste = lodash.filter(Projektpunkteliste, (Eintrag: Projektpunktestruktur) => {

          if(this.Pool.Mitarbeitersettings.UnterkostengruppeFilter !== null) {

            return Eintrag.Unterkostengruppe === this.Pool.Mitarbeitersettings.UnterkostengruppeFilter;
          }
          else if(this.Pool.Mitarbeitersettings.HauptkostengruppeFilter !== null) {

            return Eintrag.Hauptkostengruppe === this.Pool.Mitarbeitersettings.HauptkostengruppeFilter;
          }
          else if( this.Pool.Mitarbeitersettings.OberkostengruppeFilter !== null) {

            return Eintrag.Oberkostengruppe  === this.Pool.Mitarbeitersettings.OberkostengruppeFilter;
          }
          else {

            return true;
          }
        });

        // Suche anwenden

        if(this.Festlegungfiltertext !== '') {

          Liste              = lodash.cloneDeep(Projektpunkteliste);
          Projektpunkteliste = [];

          for(let Punkt of Liste) {

            Solltext = this.Festlegungfiltertext.toLowerCase();
            Suchtext = Punkt.Aufgabe.toLowerCase();
            PosA     = Suchtext.indexOf(Solltext);

            if(PosA !== -1) {

              Laenge     = Punkt.Aufgabe.length;
              Teillaenge = Solltext.length;
              TeilA      = Punkt.Aufgabe.substr(0, PosA);
              TeilB      = Punkt.Aufgabe.substr(PosA, Teillaenge);
              Teillaenge = Laenge - Teillaenge - PosA;
              TeilC      = Punkt.Aufgabe.substr(Laenge - Teillaenge, Teillaenge);

              Punkt.Filtered = true;
              Punkt.Text_A   = TeilA;
              Punkt.Text_B   = TeilB;
              Punkt.Text_C   = TeilC;

              Projektpunkteliste.push(Punkt);
            }
          }
        }

        CurrentPunkt = this.DBProjektpunkte.GetNewProjektpunkt(this.DBProjekte.CurrentProjekt, 0);

        CurrentPunkt.Kostengruppenname = 'Unbekannte Kostengruppe';

        this.DB.Kostengruppenliste.push(CurrentPunkt);

        for(let Punkt of Projektpunkteliste) {

          CurrentPunkt = lodash.find(this.DB.Kostengruppenliste, (Eintrag: Projektpunktestruktur) => {

            return Eintrag.Hauptkostengruppe === Punkt.Hauptkostengruppe &&
                   Eintrag.Oberkostengruppe  === Punkt.Oberkostengruppe  &&
                   Eintrag.Unterkostengruppe === Punkt.Unterkostengruppe;
          });

          if(lodash.isUndefined(CurrentPunkt)) {

            Punkt.Kostengruppenname = this.KostenService.GetKostengruppennameByProjektpunkt(Punkt);
            this.DB.Kostengruppenliste.push(Punkt);
          }
        }

        for(let i = 0; i < this.DB.Kostengruppenliste.length; i++) {

          CurrentPunkt = this.DB.Kostengruppenliste[i];

          this.DB.Displayliste[i] = [];

          Liste = lodash.filter(Projektpunkteliste, (Eintrag: Projektpunktestruktur) => {

            return Eintrag.Hauptkostengruppe === CurrentPunkt.Hauptkostengruppe &&
                   Eintrag.Oberkostengruppe  === CurrentPunkt.Oberkostengruppe  &&
                   Eintrag.Unterkostengruppe === CurrentPunkt.Unterkostengruppe;
          });

          for(CurrentPunkt of Liste) {

            this.DB.Displayliste[i].push(CurrentPunkt);
          }
        }

        if(this.DB.Displayliste[0].length === 0) {

          this.DB.Kostengruppenliste.shift();
          this.DB.Displayliste.shift();

        }
        else {

          Merker = this.DB.Kostengruppenliste[0];

          this.DB.Kostengruppenliste[0] = this.DB.Kostengruppenliste[this.DB.Kostengruppenliste.length - 1];
          this.DB.Kostengruppenliste[this.DB.Kostengruppenliste.length - 1] = Merker;

          Merker = this.DB.Displayliste[0];

          this.DB.Displayliste[0] = this.DB.Displayliste[this.DB.Displayliste.length - 1];
          this.DB.Displayliste[this.DB.Displayliste.length - 1] = Merker;
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungliste', 'PrepareData', this.Debug.Typen.Page);
    }
  }

  ShowProjektfilesHandler() {

    try {

      this.Menuservice.FilelisteAufrufer    = this.Menuservice.FilelisteAufrufervarianten.Festlegungen;
      this.Menuservice.ProjekteMenuebereich = this.Menuservice.ProjekteMenuebereiche.Fileliste;

      this.Menuservice.SetCurrentPage();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungliste', 'ShowProjektfilesHandler', this.Debug.Typen.Page);
    }
  }

  ProtokollButtonClicked(Punkt: Projektpunktestruktur) {

    try {

      let Protokoll: Protokollstruktur;
      let Projekt: Projektestruktur;

      this.Dialogbreite = 950;

      Projekt = lodash.find(this.DBProjekte.Gesamtprojektliste, {_id: Punkt.ProjektID});

      if(lodash.isUndefined(Projekt) === false) {

        this.DBProjekte.CurrentProjekt = Projekt;

        Protokoll = lodash.find(this.Pool.Protokollliste[Projekt.Projektkey], {_id: Punkt.ProtokollID});

        if(lodash.isUndefined(Protokoll) === false) {

          this.DBProtokolle.CurrentProtokoll = Protokoll;
        }
      }

      this.ShowProtokollEditor = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungliste', 'ProtokollButtonClicked', this.Debug.Typen.Page);
    }
  }

  LeistungsphaseClickedHandler(origin: string) {

    try {

      let Text: string;

      if(origin === 'Editor')  {

        this.Auswahltitel        = 'Leistungsphase festlegen';
        this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Festlegungsliste_Editor_Leistungsphase;
        Text                     = this.Const.Leistungsphasenvarianten.UNBEKANNT;
      }

      if(origin === 'Filter') {

        this.Auswahltitel        = 'Filter für Leistungsphase festlegen';
        Text                     = 'Alle';
        this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Festlegungsliste_Leistungsphasefilter;
      }

      this.Auswahlliste  = [];
      this.Auswahlliste.push({ Index: 0, FirstColumn: Text, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.UNBEKANNT });
      this.Auswahlliste.push({ Index: 1, FirstColumn: this.Const.Leistungsphasenvarianten.LPH1, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH1 });
      this.Auswahlliste.push({ Index: 2, FirstColumn: this.Const.Leistungsphasenvarianten.LPH2, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH2 });
      this.Auswahlliste.push({ Index: 3, FirstColumn: this.Const.Leistungsphasenvarianten.LPH3, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH3 });
      this.Auswahlliste.push({ Index: 4, FirstColumn: this.Const.Leistungsphasenvarianten.LPH4, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH4 });
      this.Auswahlliste.push({ Index: 5, FirstColumn: this.Const.Leistungsphasenvarianten.LPH5, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH5 });
      this.Auswahlliste.push({ Index: 6, FirstColumn: this.Const.Leistungsphasenvarianten.LPH6, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH6 });
      this.Auswahlliste.push({ Index: 7, FirstColumn: this.Const.Leistungsphasenvarianten.LPH7, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH7 });
      this.Auswahlliste.push({ Index: 8, FirstColumn: this.Const.Leistungsphasenvarianten.LPH8, SecoundColumn: '', Data: this.Const.Leistungsphasenvarianten.LPH8 });



      if(origin === 'Editor')  {

        this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {FirstColumn: this.DBProjektpunkte.CurrentProjektpunkt.Leistungsphase});
      }

      if(origin === 'Filter') {

        this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {FirstColumn: this.Pool.Mitarbeitersettings.LeistungsphaseFilter});
      }


      this.ShowAuswahl  = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'LeistungsphaseClickedHandler', this.Debug.Typen.Page);
    }
  }

  TeamteilnehmerClickedHandler() {

    try {

      this.AuswahlIDliste = lodash.cloneDeep(this.DBProtokolle.CurrentProtokoll.BeteiligtInternIDListe);

      this.Auswahldialogorigin    = this.Auswahlservice.Auswahloriginvarianten.Protokollliste_Protokolleditor_Teamteilnehmer;
      this.ShowMitarbeiterauswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'TeamteilnehmerClickedHandler', this.Debug.Typen.Page);
    }
  }

  AuswahlOkButtonClicked(data: any) {

    try {

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Festlegungsliste_Editor_Leistungsphase:

          this.DBProjektpunkte.CurrentProjektpunkt.Leistungsphase = data;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Festlegungsliste_Leistungsphasefilter:

          this.Pool.Mitarbeitersettings.LeistungsphaseFilter = data;

          this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings);

          this.PrepareData();

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Editor_Fachbereich:

          this.DBProjektpunkte.CurrentProjektpunkt.Fachbereich = data;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Editor_Status:

          this.DBProjektpunkte.CurrentProjektpunkt.Status = data;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Emaileditor_Standortfilter:

          this.DBStandort.CurrentStandortfilter        = data;
          this.Pool.Mitarbeitersettings.StandortFilter = data !== null ? data._id : this.Const.NONE;

          this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings).then(() => {

            this.DBStandort.StandortfilterChanged.emit();

          }).catch((error) => {

            this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
          });

          // this.PrepareDaten();

          break;


        default:

          break;
      }

      this.ShowAuswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  GetDialogTitelicon(): string {

    try {

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Festlegungsliste_Editor_Leistungsphase:

          return 'stats-chart-outline';

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Festlegungsliste_Leistungsphasefilter:

          return 'stats-chart-outline';

          break;

        default:

          break;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'GetDialogTitelicon', this.Debug.Typen.Page);
    }
  }


  ProtokollpunktClickedHandler(projetpunkt: Projektpunktestruktur) {

    try {

      this.DBProjektpunkte.CurrentProjektpunkt = lodash.cloneDeep(projetpunkt);
      this.ShowProjektpunktEditor              = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'ProtokollpunktClickedHandler', this.Debug.Typen.Page);
    }
  }

  BeteiligteteilnehmerClickedHandler() {

    try {

      this.AuswahlIDliste = lodash.cloneDeep(this.DBProtokolle.CurrentProtokoll.BeteiligExternIDListe);

      this.Auswahldialogorigin    = this.Auswahlservice.Auswahloriginvarianten.Protokollliste_Protokolleditor_Beteilgtenteilnehmer;
      this.ShowBeteiligteauswahl  = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'BeteiligteteilnehmerClickedHandler', this.Debug.Typen.Page);
    }
  }


  MitarebiterStandortfilterClickedHandler() {

    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Emaileditor_Standortfilter;

      let Index = 0;

      this.ShowAuswahl         = true;
      this.Auswahltitel        = 'Standort festlegen';
      this.Auswahlliste        = [];
      this.Auswahlhoehe        = 300;

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

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'MitarebiterStandortfilterClickedHandler', this.Debug.Typen.Page);
    }
  }

  MitarbeiterauswahlOkButtonClicked(idliste: string[]) {

    try {

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Emaileditor_Intern_Empfaenger:

          this.DB.EmpfaengerInternIDListe = idliste;

          break;


        case this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Emaileditor_Intern_CcEmpfaenger:

          this.DB.CcEmpfaengerInternIDListe = idliste;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Aufgabenliste_Editor_ZustaendigIntern:

          this.DBProjektpunkte.CurrentProjektpunkt.ZustaendigeInternIDListe = idliste;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Aufgabenliste_ZustaendigIntern:

          this.DBProjektpunkte.CurrentProjektpunkt.ZustaendigeInternIDListe = idliste;

          this.DBProjektpunkte.UpdateProjektpunkt(this.DBProjektpunkte.CurrentProjektpunkt, true);

          break;
      }

      this.ShowMitarbeiterauswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'MitarbeiterauswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  AddProtokollpunktClickedHandler() {

    try {

      if(this.DBProtokolle.CurrentProtokoll._id === null) {

        this.DBProtokolle.SaveProtokoll().then(() => {

          this.DBProjektpunkte.CurrentProjektpunkt = this.DBProjektpunkte.GetNewProtokollpunkt(this.DBProtokolle.CurrentProtokoll);
          this.ShowProjektpunktEditor              = true;
        });
      }
      else {

        this.DBProjektpunkte.CurrentProjektpunkt = this.DBProjektpunkte.GetNewProtokollpunkt(this.DBProtokolle.CurrentProtokoll);
        this.ShowProjektpunktEditor              = true;
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'AddProtokollpunktClickedHandler', this.Debug.Typen.Page);
    }
  }


  ShowProjektauswahlEventHandler() {

    try {

      this.ShowProjektschnellauswahl = true;


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungliste', 'ShowProjektauswahlEventHandler', this.Debug.Typen.Page);
    }
  }


  public ProjektSchnellauswahlProjektClickedEventHandler(projekt: Projektestruktur) {

    try {

      this.DBProjekte.CurrentProjekt      = projekt;
      this.DBProjekte.CurrentProjektindex = lodash.findIndex(this.DBProjekte.Projektliste, {_id: projekt._id});

      this.Pool.Mitarbeitersettings.Favoritprojektindex = this.DBProjekte.CurrentProjektindex;
      this.Pool.Mitarbeitersettings.ProjektID           = this.DBProjekte.CurrentProjekt._id;

      this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings);

      this.ShowProjektschnellauswahl = false;

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungliste', 'ProjektSchnellauswahlProjektClickedEventHandler', this.Debug.Typen.Page);
    }
  }


  KostengruppeClickedHandler() {

    try {

      this.KostengruppenOrigin      = 'Editor';
      this.Kostengruppeauswahltitel = 'Kostengruppe festlegen';
      this.ShowKostengruppenauswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'KostengruppeClickedHandler', this.Debug.Typen.Page);
    }
  }

  GebaeudeteilClickedHandler() {

    try {

      this.ShowRaumauswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'GebaeudeteilClickedHandler', this.Debug.Typen.Page);
    }
  }

  FachbereichClickedHandler() {

    this.Auswahltitel = 'Fachbereich festlegen';
    this.Auswahlliste = [];
    this.Auswahlhoehe = 300;

    this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Editor_Fachbereich;

    this.Auswahlliste.push({Index: 0, FirstColumn: this.Pool.Fachbereich.Unbekannt.Bezeichnung,      SecoundColumn: this.Pool.Fachbereich.Unbekannt.Kuerzel,      Data: this.Pool.Fachbereich.Unbekannt.Key});
    this.Auswahlliste.push({Index: 1, FirstColumn: this.Pool.Fachbereich.Elektrotechnik.Bezeichnung, SecoundColumn: this.Pool.Fachbereich.Elektrotechnik.Kuerzel, Data: this.Pool.Fachbereich.Elektrotechnik.Key});
    this.Auswahlliste.push({Index: 2, FirstColumn: this.Pool.Fachbereich.HLS.Bezeichnung,            SecoundColumn: this.Pool.Fachbereich.HLS.Kuerzel,            Data: this.Pool.Fachbereich.HLS.Key});
    this.Auswahlliste.push({Index: 3, FirstColumn: this.Pool.Fachbereich.HLSE.Bezeichnung,           SecoundColumn: this.Pool.Fachbereich.HLSE.Kuerzel,            Data: this.Pool.Fachbereich.HLSE.Key});
    this.Auswahlliste.push({Index: 4, FirstColumn: this.Pool.Fachbereich.H.Bezeichnung,              SecoundColumn: this.Pool.Fachbereich.H.Kuerzel,              Data: this.Pool.Fachbereich.H.Key});
    this.Auswahlliste.push({Index: 5, FirstColumn: this.Pool.Fachbereich.L.Bezeichnung,              SecoundColumn: this.Pool.Fachbereich.L.Kuerzel,              Data: this.Pool.Fachbereich.L.Key});
    this.Auswahlliste.push({Index: 6, FirstColumn: this.Pool.Fachbereich.S.Bezeichnung,              SecoundColumn: this.Pool.Fachbereich.S.Kuerzel,              Data: this.Pool.Fachbereich.S.Key});
    this.Auswahlliste.push({Index: 7, FirstColumn: this.Pool.Fachbereich.K.Bezeichnung,              SecoundColumn: this.Pool.Fachbereich.K.Kuerzel,              Data: this.Pool.Fachbereich.K.Key});
    this.Auswahlliste.push({Index: 8, FirstColumn: this.Pool.Fachbereich.MSR.Bezeichnung,            SecoundColumn: this.Pool.Fachbereich.MSR.Kuerzel,            Data: this.Pool.Fachbereich.MSR.Key});

    this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: this.DBProjektpunkte.CurrentProjektpunkt.Fachbereich});
    this.ShowAuswahl  = true;

  } catch (error) {

    this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'FachbereichClickedHandler', this.Debug.Typen.Page);
  }

  GetBeteiligtenauswahlTitel(): string {

    try {

      switch(this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Emaileditor_Extern_Empfaenger:

          return 'Empfänger festlegen';

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Emaileditor_Extern_CcEmpfaenger:

          return 'Cc Empfänge festlegen';

          break;

        default:

          return 'unbekannt';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste', 'GetBeteiligtenauswahlTitel', this.Debug.Typen.Page);
    }
  }

  BeteiligteauswahlOkButtonClicked(idliste: string[]) {

    try {

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Emaileditor_Extern_Empfaenger:

          this.DB.EmpfaengerExternIDListe = idliste;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Emaileditor_Extern_CcEmpfaenger:

          this.DB.CcEmpfaengerExternIDListe = idliste;

          break;

      }

      this.ShowBeteiligteauswahl = false;

      this.Pool.EmailempfaengerChanged.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungliste Liste', 'BeteiligteauswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  EditorZustaendigExternHandler() {

    try {

      this.AuswahlIDliste        = lodash.cloneDeep(this.DBProjektpunkte.CurrentProjektpunkt.ZustaendigeExternIDListe);
      this.Auswahldialogorigin   = this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Editor_ZustaendigExtern;
      this.ShowBeteiligteauswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungen Liste', 'EditorZustaendigExternHandler', this.Debug.Typen.Page);
    }
  }

  EditorZustaendigInternHandler() {

    try {

      this.AuswahlIDliste         = lodash.cloneDeep(this.DBProjektpunkte.CurrentProjektpunkt.ZustaendigeInternIDListe);
      this.Auswahldialogorigin    = this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Editor_ZustaendigIntern;
      this.ShowMitarbeiterauswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungen Liste', 'EditorZustaendigInternHandler', this.Debug.Typen.Page);
    }
  }

  AddFestlegungClicked() {

    try {

      this.ShowProjektpunktEditor             = true;
      this.DBProjektpunkte.CurrentProjektpunkt = lodash.cloneDeep(this.DBProjektpunkte.GetNewFestlegung());


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungen Liste', 'AddFestlegungClicked', this.Debug.Typen.Page);
    }
  }

  FestlegungClicked(Punkt: Projektpunktestruktur) {

    try {

      this.ShowProjektpunktEditor             = true;
      this.DBProjektpunkte.CurrentProjektpunkt = lodash.cloneDeep(Punkt);
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungen Liste', 'FestlegungClicked', this.Debug.Typen.Page);
    }
  }

  KostengruppeFilterClickedHandler() {

    try {

      this.KostengruppenOrigin                 = 'Filter';
      this.Kostengruppeauswahltitel            = 'Filter für Kostengruppe festlegen';
      this.DBProjektpunkte.CurrentProjektpunkt = this.DBProjektpunkte.GetNewProtokollpunkt(null);

      this.DBProjektpunkte.CurrentProjektpunkt.Oberkostengruppe  = this.Pool.Mitarbeitersettings.OberkostengruppeFilter;
      this.DBProjektpunkte.CurrentProjektpunkt.Unterkostengruppe = this.Pool.Mitarbeitersettings.UnterkostengruppeFilter;
      this.DBProjektpunkte.CurrentProjektpunkt.Hauptkostengruppe = this.Pool.Mitarbeitersettings.HauptkostengruppeFilter;

      this.ShowKostengruppenauswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungen Liste', 'KostengruppeFilterClickedHandler', this.Debug.Typen.Page);
    }
  }

  KostengruppenauswahlOkClicked() {

    try {

      this.ShowKostengruppenauswahl = false;

      if(this.KostengruppenOrigin === 'Filter') {

        this.Pool.Mitarbeitersettings.HauptkostengruppeFilter = this.DBProjektpunkte.CurrentProjektpunkt.Hauptkostengruppe;
        this.Pool.Mitarbeitersettings.UnterkostengruppeFilter = this.DBProjektpunkte.CurrentProjektpunkt.Unterkostengruppe;
        this.Pool.Mitarbeitersettings.OberkostengruppeFilter  = this.DBProjektpunkte.CurrentProjektpunkt.Oberkostengruppe;

        this.DBMitarbeitersettings.UpdateMitarbeitersettings(this.Pool.Mitarbeitersettings);

        this.PrepareData();
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungen Liste', 'KostengruppenauswahlOkClicked', this.Debug.Typen.Page);
    }

  }

  SucheChangedHandler(text: string) {

    try {

      this.Festlegungfiltertext = text;

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungen Liste', 'SucheChangedHandler', this.Debug.Typen.Page);
    }
  }

  ShowOpenFestlegungOnlyHandler(status: boolean) {

    try {

      this.ShowOpenFestlegungOnly = status;

      this.PrepareData();


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungen Liste', 'ShowOpenFestlegungOnlyHandler', this.Debug.Typen.Page);
    }
  }

  CcEmpfaengerBurnicklClickedHandler() {

    try {

      this.Auswahldialogorigin    = this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Emaileditor_Intern_CcEmpfaenger;
      this.AuswahlIDliste         = this.DB.CcEmpfaengerInternIDListe;
      this.ShowMitarbeiterauswahl = true;
      this.Dialoghoehe            = this.Basics.InnerContenthoehe - 200;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungliste Liste', 'CcEmpfaengerBurnicklClickedHandler', this.Debug.Typen.Page);
    }
  }

  EmpfaengerExternClickedHandler() {

    try {


      this.Auswahldialogorigin   = this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Emaileditor_Extern_Empfaenger;
      this.AuswahlIDliste        = this.DB.EmpfaengerExternIDListe;
      this.ShowBeteiligteauswahl = true;
      this.Dialoghoehe           = this.Basics.InnerContenthoehe - 200;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungliste Liste', 'EmpfaengerExternClickedHandler', this.Debug.Typen.Page);
    }
  }

  CcEmpfaengerExternClickedHandler() {

    try {

      this.Auswahldialogorigin   = this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Emaileditor_Extern_CcEmpfaenger;
      this.AuswahlIDliste        = this.DB.CcEmpfaengerExternIDListe;
      this.ShowBeteiligteauswahl = true;
      this.Dialoghoehe           = this.Basics.InnerContenthoehe - 200;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungliste Liste', 'EmpfaengerExternClickedHandler', this.Debug.Typen.Page);
    }
  }

  EmpfaengerBurnicklClickedHandler() {

    try {

      this.Auswahldialogorigin    = this.Auswahlservice.Auswahloriginvarianten.Festlegungliste_Emaileditor_Intern_Empfaenger;
      this.AuswahlIDliste        = this.DB.EmpfaengerInternIDListe;
      this.ShowMitarbeiterauswahl = true;
      this.Dialoghoehe            = this.Basics.InnerContenthoehe - 200;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungliste Liste', 'EmpfaengerBurnicklClickedHandler', this.Debug.Typen.Page);
    }
  }

  EmailSendenOkButtonClicked(event: any) {

    try {

      this.ShowEmailSenden = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungen Liste', 'EmailSendenOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  async SendFestlegungenClickedHandler() {

    try {

      event.stopPropagation();
      event.preventDefault();

      this.Pool.Emailcontent   = this.Pool.Emailcontentvarinaten.Festlegungen;
      this.EmailDialogbreite   = 1100;
      this.EmailDialoghoehe    = this.Basics.InnerContenthoehe - 200;
      this.ShowEmailSenden     = true;
      this.DB.Filename         = MyMoment().format('YYMMDD') + '_Festlegungen.pdf';
      this.DB.Betreff          = 'Festlegungen ' + this.DBProjekte.CurrentProjekt.Projektname;
      this.DB.Nachricht        =
        `Sehr geehrte Damen und Herren,

        anbei sende ich Ihnen den aktuellen Stand der Festlegungsliste.`;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Festlegungen Liste', 'SendFestlegungenClickedHandler', this.Debug.Typen.Page);
    }
  }
}
