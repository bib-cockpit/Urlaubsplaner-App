import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {ConstProvider} from "../../services/const/const";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {AlphabetComponent} from "../../components/alphabet/alphabet";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Subscription} from "rxjs";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import * as lodash from "lodash-es";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {AuswahlDialogService} from "../../services/auswahl-dialog/auswahl-dialog.service";

@Component({
  selector: 'fi-mitarbeiterliste-page',
  templateUrl: 'fi-mitarbeiterliste.html',
  styleUrls: ['fi-mitarbeiterliste.scss'],
})
export class FiMitarbeiterlistePage implements OnInit, OnDestroy {

  @ViewChild('Alphabet', { static: false })   Alphabetcomponent: AlphabetComponent;
  @ViewChild('PageHeader', { static: false }) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', { static: false }) PageFooter: PageFooterComponent;

  private ListeSubscription: Subscription;
  public Mitarbeiterliste: Mitarbeiterstruktur[];
  public Mitarbeiteralphabet: string[];
  public Alphapetbreite: number;
  public Mitarbeiteralphabetauswahl: string;
  public HideAuswahl: boolean;
  public Auswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public Lastletter: string;
  public Mitarbeiterbuchstabenliste: string[];
  public Standardalphabet: string[];
  public Zusatzbuttonliste: string[];
  public Mitarbeiterfiltertext: string;
  // public Mitarbeiterfilter: string;
  public Inputtimer;
  public Listenbreite: number;
  public ShowEditor: boolean;
  private EditorValid: boolean;
  public ShowAuswahl: boolean;
  private Auswahldialogorigin: string;
  private StandortfilterSubsciption: Subscription;
  public ShowMeOnly: boolean;
  public ShowArchivierte: boolean;
  public ShowAktuelle: boolean;
  public Freigabefiltervarianten = {

    Keiner:              'keiner',
    Administrator:       'Administrator',
    Urlaubsfreigaben:    'Urlaubsfreigaben',
    Homeofficefreigaben: 'Homeofficefreigaben'
  };
  public Freigabefilter: string;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public Const: ConstProvider,
              public DB: DatabaseMitarbeiterService,
              public DBStandort: DatabaseStandorteService,
              public Auswahlservice: AuswahlDialogService,
              public  Pool: DatabasePoolService) {
    try
    {
      this.Standardalphabet  = ['Alle', 'A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J', 'K','L', 'M', 'N', 'O', 'P', 'Q','R', 'S', 'T', 'U', 'V', 'W','X', 'Y', 'Z'];
      this.Mitarbeiteralphabet    = [];
      this.Mitarbeiteralphabetauswahl   = 'Alle';
      this.Mitarbeiterliste             = [];
      this.Alphapetbreite    = 44;
      this.Zusatzbuttonliste =[];
      this.HideAuswahl       = true;
      this.Mitarbeiteralphabet    = this.Standardalphabet;
      this.Mitarbeiterbuchstabenliste   = [];
      this.Mitarbeiterfiltertext = '';
      this.Listenbreite      = 0;
      this.ShowEditor        = false;
      this.EditorValid       = false;
      this.ShowAuswahl       = false;
      this.Auswahltitel      = 'Standort festlegen';
      this.Auswahlliste      = [];
      this.Auswahldialogorigin = this.Const.NONE;
      this.ListeSubscription   = null;
      this.StandortfilterSubsciption = null;
      this.ShowMeOnly      = false;
      this.ShowArchivierte = false;
      this.ShowAktuelle    = true;
      this.Freigabefilter  = this.Freigabefiltervarianten.Keiner;

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

      if(this.ListeSubscription !== null) {

        this.ListeSubscription.unsubscribe();
        this.ListeSubscription = null;
      }

      if(this.StandortfilterSubsciption !== null) {

        this.StandortfilterSubsciption.unsubscribe();
        this.StandortfilterSubsciption = null;
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

      this.ListeSubscription = this.Pool.MitarbeiterlisteChanged.subscribe(() => {

        this.PrepareDaten();
      });

      this.StandortfilterSubsciption = this.DBStandort.StandortfilterChanged.subscribe(() => {

        this.PrepareDaten();
      });

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'OnInit', this.Debug.Typen.Page);
    }
  }

  ResetSucheButtonClicked() {

    try {
      this.Mitarbeiterfiltertext         = '';
      this.Mitarbeiteralphabetauswahl    = 'Alle';

      this.PrepareDaten();

      /*
      switch (this.Menueindex) {

        case 0:


          break;

        case 1:

          this.Lieferantenfiltertext         = '';
          this.Lieferantenfilter             = '';
          this.Lieferantenalphabetauswahl    = 'Alle';
          this.Suchleiste.value              = '';

          this.PrepareLieferantenDaten();

          break;
      }

       */

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'ResetSucheButtonClicked', this.Debug.Typen.Page);
    }
  }

  public ionViewDidEnter() {

    try {

      let Alphabetbreite: number = typeof this.Alphabetcomponent.Breite !== 'undefined' ? this.Alphabetcomponent.Breite : 40;

      this.Basics.MeassureInnercontent(this.PageHeader, this.PageFooter);

      this.Listenbreite = this.Basics.Contentbreite - Alphabetbreite - 4;

      this.Alphabetcomponent.InitScreen();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }

  ionViewDidLeave() {

    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'ionViewDidLeave', this.Debug.Typen.Page);
    }
  }

  MitrabeiterButtonClicked(eintrag: Mitarbeiterstruktur) {

    try {

      this.DB.CurrentMitarbeiter = lodash.cloneDeep(eintrag);
      this.ShowEditor            = true;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'MitrabeiterButtonClicked', this.Debug.Typen.Page);
    }
  }

  AddMitarbeiterButtonClicked() {

    try {

        this.DB.CurrentMitarbeiter = this.DB.GetEmptyMitarbeiter();
        this.ShowEditor            = true;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'AddMitarbeiterButtonClicked', this.Debug.Typen.Page);
    }
  }

  AlphabetClicked(buchstabe: any) {

    try {

      this.Mitarbeiterfiltertext       = '';
      this.Mitarbeiteralphabetauswahl  = buchstabe;

      this.PrepareDaten();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Mitarbeiterliste', 'AlphabetClicked', this.Debug.Typen.Page);
    }
  }

  private GetMitarbeiterAlphabetbuchstabe(value: Mitarbeiterstruktur) {

    try {

      let Buchstabe: string = value.Name.substring(0, 1).toUpperCase();

      if(Buchstabe !== this.Lastletter) {

        this.Lastletter = Buchstabe;

        return Buchstabe;
      }
      else {

        return '';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'GetMitarbeiterAlphabetbuchstabe', this.Debug.Typen.Page);
    }
  }


  private PrepareDaten() {

    try {

      let Liste:  Mitarbeiterstruktur[];
      let Merker: Mitarbeiterstruktur[];
      let Buchstabe: string;
      let Quelle: Mitarbeiterstruktur[];
      let Laenge: number;
      let TeilA: string;
      let TeilB: string;
      let TeilC: string;
      let Teillaenge: number;
      let PosA: number;
      let Solltext: string;
      let Suchtext: string;

      if(this.Pool.Mitarbeiterliste !== null) {

        Quelle = lodash.cloneDeep(this.Pool.Mitarbeiterliste);

        this.Lastletter = '';

        // Nach Namen sortieren

        Quelle.sort( (a: Mitarbeiterstruktur, b: Mitarbeiterstruktur) => {

          if (a.Name > b.Name) return -1;
          if (a.Name < b.Name) return 1;
          return 0;
        });

        // Filter

        Liste = lodash.cloneDeep(Quelle);

        if(this.ShowMeOnly) {

          Liste = lodash.filter(Liste, {_id: this.Pool.Mitarbeiterdaten._id});
        }
        else {

          if(this.ShowArchivierte === true && this.ShowAktuelle === true) {

            // do nothing
          }
          else if(this.ShowArchivierte) {

              Liste = lodash.filter(Liste, (Eintrag: Mitarbeiterstruktur) => {

                return Eintrag.Archiviert;
              });
          }
          else if(this.ShowAktuelle) {

            Liste = lodash.filter(Liste, (Eintrag: Mitarbeiterstruktur) => {

              return !Eintrag.Archiviert;
            });
          }
          else if(this.ShowArchivierte === false && this.ShowAktuelle === false) {

            Liste = [];
          }
        }

        // Freigabefilter

        if(this.Freigabefilter !== this.Freigabefiltervarianten.Keiner) {

          switch (this.Freigabefilter) {

            case this.Freigabefiltervarianten.Administrator:

              Liste = lodash.filter(Liste, {Planeradministrator: true});

              break;

            case this.Freigabefiltervarianten.Urlaubsfreigaben:

              Liste = lodash.filter(Liste, { Urlaubsfreigaben: true});

              break;

            case this.Freigabefiltervarianten.Homeofficefreigaben:

              Liste = lodash.filter(Liste, { Homeofficefreigaben: true});

              break;
          }
        }

        // Standortfilter anwenden

        if(this.DBStandort.CurrentStandortfilter !== null) {

          Liste = lodash.filter(Liste, (eintrag: Mitarbeiterstruktur) => {

            return eintrag.StandortID === this.DBStandort.CurrentStandortfilter._id;
          });
        }

        Liste.sort( (a: Mitarbeiterstruktur, b: Mitarbeiterstruktur) => {

          if (a.Name < b.Name) return -1;
          if (a.Name > b.Name) return 1;
          return 0;
        });


        // Mitarbeiteralphabetauswahl Buchstaben festlegen

        if(Liste.length > 6) {

          this.Mitarbeiteralphabet = ['Alle'];

          for(let Eintrag of Liste) {

            Buchstabe = Eintrag.Name.substring(0, 1).toUpperCase();

            if(this.Mitarbeiteralphabet.indexOf(Buchstabe) === -1) this.Mitarbeiteralphabet.push(Buchstabe);
          }
        } else {

          this.Mitarbeiteralphabet = this.Standardalphabet;
        }

        // Alphabetfilter anwenden

        if(this.Mitarbeiteralphabetauswahl !== 'Alle') {

          Merker = lodash.cloneDeep(Liste);

          Liste = [];

          for(let Eintrag of Merker) {

            Buchstabe = Eintrag.Name.substring(0, 1).toUpperCase();

            Buchstabe = Buchstabe === 'Ä' ? 'A' : Buchstabe;
            Buchstabe = Buchstabe === 'Ö' ? 'O' : Buchstabe;
            Buchstabe = Buchstabe === 'Ü' ? 'U' : Buchstabe;

            if(this.Mitarbeiteralphabetauswahl === Buchstabe) Liste.push(Eintrag);
          }
        }

        // Suche Mitarbeiterfilter anwenden

        if(this.Mitarbeiterfiltertext !== '') {

          Merker = lodash.cloneDeep(Liste);
          Liste  = [];

          for(let Eintrag of Merker) {

            Solltext = this.Mitarbeiterfiltertext.toLowerCase();
            Suchtext = Eintrag.Name.toLowerCase();
            PosA     = Suchtext.indexOf(Solltext);

            if(PosA !== -1) {

              Laenge     = Eintrag.Name.length;
              Teillaenge = Solltext.length;
              TeilA      = Eintrag.Name.substr(0, PosA);
              TeilB      = Eintrag.Name.substr(PosA, Teillaenge);
              Teillaenge = Laenge - Teillaenge - PosA;
              TeilC      = Eintrag.Name.substr(Laenge - Teillaenge, Teillaenge);

              Eintrag.Filtered = true;
              Eintrag.Text_A   = TeilA;
              Eintrag.Text_B   = TeilB;
              Eintrag.Text_C   = TeilC;

              Liste.push(Eintrag);
            }
          }
        }

        // Buchstabenliste festlegen

        this.Mitarbeiterbuchstabenliste = [];

        for(let Eintrag of Liste) {

          this.Mitarbeiterbuchstabenliste.push(this.GetMitarbeiterAlphabetbuchstabe(Eintrag));
        }

        this.Mitarbeiterliste = lodash.cloneDeep(Liste);
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'PrepareDaten', this.Debug.Typen.Page);
    }
  }

  EditorValidChanged(event: boolean) {

    try {

      this.EditorValid = event;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'EditorValidChanged', this.Debug.Typen.Page);
    }
  }

  GetDialogTitel(): string {

    try {

      if(this.DB.CurrentMitarbeiter !== null) {

        return this.DB.CurrentMitarbeiter._id === null ? 'Neuen Mitarbeiter anlegen' : 'Mitarbeiter bearbeiten';
      }
      else {

        return 'Unbekannt';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'GetDialogTitel', this.Debug.Typen.Page);
    }
  }

  StandortClickedHandler() {

    try {

      let Index = 0;

      this.ShowAuswahl  = true;
      this.Auswahltitel = 'Standort festlegen';
      this.Auswahlliste = [];

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Standort;

      for(let Eintrag of this.Pool.Standorteliste) {

        this.Auswahlliste.push({ Index: Index, FirstColumn: Eintrag.Kuerzel, SecoundColumn: Eintrag.Ort, Data: Eintrag });
        Index++;
      }


      this.Auswahlindex = lodash.findIndex(this.Pool.Standorteliste, {_id: this.DB.CurrentMitarbeiter.StandortID});

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'StandortClickedHandler', this.Debug.Typen.Page);
    }
  }

  AuswahlOkButtonClicked(data: any) {

    try {

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Anrede:

          this.DB.CurrentMitarbeiter.Anrede = data;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Urlaub:

          this.DB.CurrentMitarbeiter.Urlaub = data;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Standort:

          this.DB.CurrentMitarbeiter.StandortID = data._id;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Liste_Position:

          this.DB.CurrentMitarbeiter.PositionID = data;

          break;

        case 'Resturlaub':

          this.DB.CurrentMitarbeiter.Resturlaub = data;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Liste_Standortfilter:

          this.DBStandort.CurrentStandortfilter        = data;
          this.Pool.Mitarbeitersettings.StandortFilter = data !== null ? data._id : this.Const.NONE;
          this.Mitarbeiteralphabetauswahl              = 'Alle';

          this.DB.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten).then(() => {

            this.DBStandort.StandortfilterChanged.emit();

          }).catch((error) => {

            this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
          });

          this.PrepareDaten();

          break;
      }

      this.ShowAuswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  GetDialogTitelicon(): string {

    try {

      if(this.DB.CurrentMitarbeiter || this.Pool.Mitarbeiterdaten) {

        switch (this.Auswahltitel) {

          case 'Standort festlegen':

            return 'location-outline';

            break;

          case 'Fachbereich festlegen':

            return 'hammer-outline';

            break;

          case 'Standortfilter festlegen':

            return 'location-outline';

            break;

          default:

            return 'help-outline';

            break;
        }
      }
      else return 'help-outline';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'GetDialogTitelicon', this.Debug.Typen.Page);
    }
  }

  SucheChanged(text: string) {

    try {

      this.Mitarbeiteralphabetauswahl = 'Alle';
      this.Mitarbeiterfiltertext      = text;

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'SucheChanged', this.Debug.Typen.Page);
    }
  }

  StandortFilterClickedHandler() {

    try {

      let Index = 0;

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Liste_Standortfilter;

      this.ShowAuswahl   = true;
      this.Auswahltitel  = 'Standortfilter festlegen';
      this.Auswahlliste  = [];

      this.Auswahlliste.push({Index: Index, FirstColumn: '----', SecoundColumn: 'kein Filter', Data: null});
      Index++;

      for(let Eintrag of this.Pool.Standorteliste) {

        this.Auswahlliste.push({ Index: Index, FirstColumn: Eintrag.Kuerzel, SecoundColumn: Eintrag.Ort, Data: Eintrag });
        Index++;
      }

      if(this.DBStandort.CurrentStandortfilter === null) {

        this.Auswahlindex = 0;
      }
      else {

        this.Auswahlindex = lodash.findIndex(this.Pool.Standorteliste, {_id: this.DBStandort.CurrentStandortfilter._id});
        this.Auswahlindex++;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'StandortFilterClickedHandler', this.Debug.Typen.Page);
    }
  }

  ShowMeCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.ShowMeOnly = event.status;

      if(this.ShowMeOnly === true) {

        this.DBStandort.CurrentStandortfilter = null;
        this.Pool.Mitarbeitersettings.StandortFilter = this.Const.NONE;
        this.Mitarbeiteralphabetauswahl = 'Alle';

        this.DB.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten).then(() => {

          this.DBStandort.StandortfilterChanged.emit();

        });
      }

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiterliste', 'ShowMeCheckedChanged', this.Debug.Typen.Page);
    }
  }

  ShowArchivierteChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.ShowArchivierte = event.status;

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiterliste', 'ShowArchivierteChanged', this.Debug.Typen.Page);
    }
  }

  AnredeClickedEventHandler() {

    try {

      this.ShowAuswahl  = true;
      this.Auswahltitel = 'Anrede festlegen';
      this.Auswahlliste = [];

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Anrede;

      this.Auswahlliste.push({ Index: 0, FirstColumn: 'Unbekannt', SecoundColumn: '', Data: this.Const.NONE });
      this.Auswahlliste.push({ Index: 1, FirstColumn: 'Frau',      SecoundColumn: '', Data: 'Frau' });
      this.Auswahlliste.push({ Index: 2, FirstColumn: 'Herr',      SecoundColumn: '', Data: 'Herr' });

      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: this.DB.CurrentMitarbeiter.Anrede});


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiterliste', 'AnredeClickedEventHandler', this.Debug.Typen.Page);
    }
  }

  UrlaubClickedEventHandler() {

    this.ShowAuswahl  = true;
    this.Auswahltitel = 'Urlaubstage festlegen';
    this.Auswahlliste = [];

    this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Urlaub;

    this.Auswahlliste.push({ Index:  0, FirstColumn:  '0', SecoundColumn: '', Data:  0 });
    this.Auswahlliste.push({ Index:  1, FirstColumn:  '1', SecoundColumn: '', Data:  1 });
    this.Auswahlliste.push({ Index:  2, FirstColumn:  '2', SecoundColumn: '', Data:  2 });
    this.Auswahlliste.push({ Index:  3, FirstColumn:  '3', SecoundColumn: '', Data:  3 });
    this.Auswahlliste.push({ Index:  4, FirstColumn:  '4', SecoundColumn: '', Data:  4 });
    this.Auswahlliste.push({ Index:  5, FirstColumn:  '5', SecoundColumn: '', Data:  5 });
    this.Auswahlliste.push({ Index:  6, FirstColumn:  '6', SecoundColumn: '', Data:  6 });
    this.Auswahlliste.push({ Index:  7, FirstColumn:  '7', SecoundColumn: '', Data:  7 });
    this.Auswahlliste.push({ Index:  8, FirstColumn:  '8', SecoundColumn: '', Data:  8 });
    this.Auswahlliste.push({ Index:  9, FirstColumn:  '9', SecoundColumn: '', Data:  9 });
    this.Auswahlliste.push({ Index: 10, FirstColumn: '10', SecoundColumn: '', Data: 10 });
    this.Auswahlliste.push({ Index: 11, FirstColumn: '11', SecoundColumn: '', Data: 11 });
    this.Auswahlliste.push({ Index: 12, FirstColumn: '12', SecoundColumn: '', Data: 12 });
    this.Auswahlliste.push({ Index: 13, FirstColumn: '13', SecoundColumn: '', Data: 13 });
    this.Auswahlliste.push({ Index: 14, FirstColumn: '14', SecoundColumn: '', Data: 14 });
    this.Auswahlliste.push({ Index: 15, FirstColumn: '15', SecoundColumn: '', Data: 15 });
    this.Auswahlliste.push({ Index: 16, FirstColumn: '16', SecoundColumn: '', Data: 16 });
    this.Auswahlliste.push({ Index: 17, FirstColumn: '17', SecoundColumn: '', Data: 17 });
    this.Auswahlliste.push({ Index: 18, FirstColumn: '18', SecoundColumn: '', Data: 18 });
    this.Auswahlliste.push({ Index: 19, FirstColumn: '19', SecoundColumn: '', Data: 19 });
    this.Auswahlliste.push({ Index: 20, FirstColumn: '20', SecoundColumn: '', Data: 20 });
    this.Auswahlliste.push({ Index: 21, FirstColumn: '21', SecoundColumn: '', Data: 21 });
    this.Auswahlliste.push({ Index: 22, FirstColumn: '22', SecoundColumn: '', Data: 22 });
    this.Auswahlliste.push({ Index: 23, FirstColumn: '23', SecoundColumn: '', Data: 23 });
    this.Auswahlliste.push({ Index: 24, FirstColumn: '24', SecoundColumn: '', Data: 24 });
    this.Auswahlliste.push({ Index: 25, FirstColumn: '25', SecoundColumn: '', Data: 25 });
    this.Auswahlliste.push({ Index: 26, FirstColumn: '26', SecoundColumn: '', Data: 26 });
    this.Auswahlliste.push({ Index: 27, FirstColumn: '27', SecoundColumn: '', Data: 27 });
    this.Auswahlliste.push({ Index: 28, FirstColumn: '28', SecoundColumn: '', Data: 28 });
    this.Auswahlliste.push({ Index: 29, FirstColumn: '29', SecoundColumn: '', Data: 29 });
    this.Auswahlliste.push({ Index: 30, FirstColumn: '30', SecoundColumn: '', Data: 30 });
    this.Auswahlliste.push({ Index: 31, FirstColumn: '31', SecoundColumn: '', Data: 31 });
    this.Auswahlliste.push({ Index: 32, FirstColumn: '32', SecoundColumn: '', Data: 32 });
    this.Auswahlliste.push({ Index: 33, FirstColumn: '33', SecoundColumn: '', Data: 33 });
    this.Auswahlliste.push({ Index: 34, FirstColumn: '34', SecoundColumn: '', Data: 34 });
    this.Auswahlliste.push({ Index: 35, FirstColumn: '35', SecoundColumn: '', Data: 35 });
    this.Auswahlliste.push({ Index: 36, FirstColumn: '36', SecoundColumn: '', Data: 36 });
    this.Auswahlliste.push({ Index: 37, FirstColumn: '37', SecoundColumn: '', Data: 36 });
    this.Auswahlliste.push({ Index: 38, FirstColumn: '38', SecoundColumn: '', Data: 36 });
    this.Auswahlliste.push({ Index: 39, FirstColumn: '39', SecoundColumn: '', Data: 36 });
    this.Auswahlliste.push({ Index: 40, FirstColumn: '40', SecoundColumn: '', Data: 40 });


    this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: this.DB.CurrentMitarbeiter.Urlaub});


  } catch (error) {

    this.Debug.ShowErrorMessage(error, 'Mitarbeiterliste', 'UrlaubClickedEventHandler', this.Debug.Typen.Page);
  }

  ShowAktuelleChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      this.ShowAktuelle = event.status;

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiterliste', 'ShowAktuelleChanged', this.Debug.Typen.Page);
    }

  }

  GetStandortliste(Urlaubsfreigabeorte: string[]): string {

    try {

      let Standort: Standortestruktur;
      let Standortliste: Standortestruktur[] = [];
      let Text: string = '';
      let Index: number = 0;


      for(let id of Urlaubsfreigabeorte) {

        Standort = lodash.find(this.Pool.Standorteliste, {_id: id});

        if(!lodash.isUndefined(Standort)) Standortliste.push(Standort);
      }

      Standortliste.sort((a: Standortestruktur, b: Standortestruktur) => {

        if (a.Ort < b.Ort) return -1;
        if (a.Ort > b.Ort) return 1;

        return 0;
      });

      for(Standort of Standortliste) {

        Text += Standort.Ort.substring(0, 3).toUpperCase();

        if(Index < Standortliste.length - 1) Text += ', ';

        Index++;
      }

      return Text;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiterliste', 'GetStandortliste', this.Debug.Typen.Page);
    }
  }

  FreigabefilterChanged(event: any) {

    try {

      this.Freigabefilter = event.detail.value;

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiterliste', 'FreigabefilterChanged', this.Debug.Typen.Page);
    }
  }

  PositionClickedEventHandler() {

    try {

      let Index = 0;

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Liste_Position;

      this.ShowAuswahl   = true;
      this.Auswahltitel  = 'Possition festlegen';
      this.Auswahlliste  = [];

      for(let Eintrag of this.Pool.Mitarbeiterpositionenliste) {

        this.Auswahlliste.push({ Index: Index, FirstColumn: Eintrag.Bezeichnung, SecoundColumn: '', Data: Eintrag._id });
        Index++;
      }

      debugger;


      this.Auswahlindex = lodash.findIndex(this.Pool.Mitarbeiterpositionenliste, {_id: this.DB.CurrentMitarbeiter.PositionID});
      this.Auswahlindex++;


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiterliste', 'PositionClickedEventHandler', this.Debug.Typen.Page);
    }
  }


  ResturlaubClicked() {

    try {

      this.Auswahldialogorigin = 'Resturlaub';
      this.Auswahltitel = 'Resturlaub festlegen';
      this.Auswahlliste = [];

      this.Auswahlliste.push({Index:  0, FirstColumn: '-10,0', SecoundColumn: 'Tage', Data: -10.0});
      this.Auswahlliste.push({Index:  1, FirstColumn:  '-9,5', SecoundColumn: 'Tage', Data: -9.5});
      this.Auswahlliste.push({Index:  2, FirstColumn:  '-9,0', SecoundColumn: 'Tage', Data: -9.0});
      this.Auswahlliste.push({Index:  3, FirstColumn:  '-8,5', SecoundColumn: 'Tage', Data: -8.5});
      this.Auswahlliste.push({Index:  4, FirstColumn:  '-8,0', SecoundColumn: 'Tage', Data: -8.0});
      this.Auswahlliste.push({Index:  5, FirstColumn:  '-7,5', SecoundColumn: 'Tage', Data: -7.5});
      this.Auswahlliste.push({Index:  6, FirstColumn:  '-7,0', SecoundColumn: 'Tage', Data: -7.0});
      this.Auswahlliste.push({Index:  7, FirstColumn:  '-6,5', SecoundColumn: 'Tage', Data: -6.5});
      this.Auswahlliste.push({Index:  8, FirstColumn:  '-6,0', SecoundColumn: 'Tage', Data: -6.0});
      this.Auswahlliste.push({Index:  9, FirstColumn:  '-5,5', SecoundColumn: 'Tage', Data: -5.5});
      this.Auswahlliste.push({Index: 10, FirstColumn:  '-5,0', SecoundColumn: 'Tage', Data: -5.0});
      this.Auswahlliste.push({Index: 11, FirstColumn:  '-4,5', SecoundColumn: 'Tage', Data: -4.5});
      this.Auswahlliste.push({Index: 12, FirstColumn:  '-4,0', SecoundColumn: 'Tage', Data: -4.0});
      this.Auswahlliste.push({Index: 13, FirstColumn:  '-3,5', SecoundColumn: 'Tage', Data: -3.5});
      this.Auswahlliste.push({Index: 14, FirstColumn:  '-3,0', SecoundColumn: 'Tage', Data: -3.0});
      this.Auswahlliste.push({Index: 15, FirstColumn:  '-2,5', SecoundColumn: 'Tage', Data: -2.5});
      this.Auswahlliste.push({Index: 16, FirstColumn:  '-2,0', SecoundColumn: 'Tage', Data: -2.0});
      this.Auswahlliste.push({Index: 17, FirstColumn:  '-1,5', SecoundColumn: 'Tage', Data: -1.5});
      this.Auswahlliste.push({Index: 18, FirstColumn:  '-1,0', SecoundColumn: 'Tag', Data:  -1.0});
      this.Auswahlliste.push({Index: 19, FirstColumn:  '-0,5', SecoundColumn: 'Tage', Data: -0.5});

      this.Auswahlliste.push({Index: 20, FirstColumn:     '0', SecoundColumn: 'Tage', Data: 0});

      this.Auswahlliste.push({Index: 21, FirstColumn:   '0,5', SecoundColumn: 'Tage', Data: 0.5});
      this.Auswahlliste.push({Index: 22, FirstColumn:   '1,0', SecoundColumn: 'Tag',  Data: 1.0});
      this.Auswahlliste.push({Index: 33, FirstColumn:   '1,5', SecoundColumn: 'Tage', Data: 1.5});
      this.Auswahlliste.push({Index: 24, FirstColumn:   '2,0', SecoundColumn: 'Tage', Data: 2.0});
      this.Auswahlliste.push({Index: 25, FirstColumn:   '2,5', SecoundColumn: 'Tage', Data: 2.5});
      this.Auswahlliste.push({Index: 26, FirstColumn:   '3,0', SecoundColumn: 'Tage', Data: 3.0});
      this.Auswahlliste.push({Index: 27, FirstColumn:   '3,5', SecoundColumn: 'Tage', Data: 3.5});
      this.Auswahlliste.push({Index: 28, FirstColumn:   '4,0', SecoundColumn: 'Tage', Data: 4.0});
      this.Auswahlliste.push({Index: 29, FirstColumn:   '4,5', SecoundColumn: 'Tage', Data: 4.5});
      this.Auswahlliste.push({Index: 30, FirstColumn:   '5,0', SecoundColumn: 'Tage', Data: 5.0});
      this.Auswahlliste.push({Index: 31, FirstColumn:   '5,5', SecoundColumn: 'Tage', Data: 5.5});
      this.Auswahlliste.push({Index: 32, FirstColumn:   '6,0', SecoundColumn: 'Tage', Data: 6.0});
      this.Auswahlliste.push({Index: 33, FirstColumn:   '6,5', SecoundColumn: 'Tage', Data: 6.5});
      this.Auswahlliste.push({Index: 34, FirstColumn:   '7,0', SecoundColumn: 'Tage', Data: 7.0});
      this.Auswahlliste.push({Index: 35, FirstColumn:   '7,5', SecoundColumn: 'Tage', Data: 7.5});
      this.Auswahlliste.push({Index: 36, FirstColumn:   '8,0', SecoundColumn: 'Tage', Data: 8.0});
      this.Auswahlliste.push({Index: 37, FirstColumn:   '8,5', SecoundColumn: 'Tage', Data: 8.5});
      this.Auswahlliste.push({Index: 38, FirstColumn:   '9,0', SecoundColumn: 'Tage', Data: 9.0});
      this.Auswahlliste.push({Index: 39, FirstColumn:   '9,5', SecoundColumn: 'Tage', Data: 9.5});
      this.Auswahlliste.push({Index: 30, FirstColumn:  '10,0', SecoundColumn: 'Tage', Data: 10.0});

      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, (Eintrag: Auswahldialogstruktur) => {

        return Eintrag.Data === this.DB.CurrentMitarbeiter.Resturlaub;
      });

      this.ShowAuswahl = true;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiterliste', 'ResturlaubClicked', this.Debug.Typen.Page);
    }
  }
}
