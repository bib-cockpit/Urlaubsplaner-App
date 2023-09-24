import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {ConstProvider} from "../../services/const/const";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {AlphabetComponent} from "../../components/alphabet/alphabet";
import {IonSearchbar} from "@ionic/angular";
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
import {Fachbereiche} from "../../dataclasses/fachbereicheclass";

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

        if(this.ShowMeOnly) {

          Liste = lodash.cloneDeep(Quelle);
          Liste = lodash.filter(Liste, {_id: this.Pool.Mitarbeiterdaten._id});
        }
        else {

          Liste = lodash.cloneDeep(Quelle);
        }

        if(this.ShowArchivierte === false) {

          Liste = lodash.filter(Liste, (Eintrag: Mitarbeiterstruktur) => {

            return !Eintrag.Archiviert;
          });
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

        // Administrator aussortieren

        Merker = lodash.cloneDeep(Liste);
        Liste  = [];

        for(let Eintrag of Merker) {

          Liste.push(Eintrag);
        }

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

        case this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Standort:

          this.DB.CurrentMitarbeiter.StandortID = data._id;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Fachbereich:

          this.DB.CurrentMitarbeiter.Fachbereich = data;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Liste_Standortfilter:

          this.DBStandort.CurrentStandortfilter = data;
          this.Pool.Mitarbeitersettings.StandortFilter = data !== null ? data._id : this.Const.NONE;

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

  FachbereichClickedHandler() {

    try {


      this.ShowAuswahl  = true;
      this.Auswahltitel = 'Fachbereich festlegen';
      this.Auswahlliste = [];

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Mitarbeiter_Editor_Fachbereich;

      this.Auswahlliste.push({Index: 0, FirstColumn: this.Pool.Fachbereich.Unbekannt.Bezeichnung,      SecoundColumn: this.Pool.Fachbereich.Unbekannt.Kuerzel,      Data: this.Pool.Fachbereich.Unbekannt.Key});
      this.Auswahlliste.push({Index: 1, FirstColumn: this.Pool.Fachbereich.Elektrotechnik.Bezeichnung, SecoundColumn: this.Pool.Fachbereich.Elektrotechnik.Kuerzel, Data: this.Pool.Fachbereich.Elektrotechnik.Key});
      this.Auswahlliste.push({Index: 2, FirstColumn: this.Pool.Fachbereich.HLS.Bezeichnung,            SecoundColumn: this.Pool.Fachbereich.HLS.Kuerzel,            Data: this.Pool.Fachbereich.HLS.Key});
      this.Auswahlliste.push({Index: 3, FirstColumn: this.Pool.Fachbereich.H.Bezeichnung,              SecoundColumn: this.Pool.Fachbereich.H.Kuerzel,              Data: this.Pool.Fachbereich.H.Key});
      this.Auswahlliste.push({Index: 4, FirstColumn: this.Pool.Fachbereich.L.Bezeichnung,              SecoundColumn: this.Pool.Fachbereich.L.Kuerzel,              Data: this.Pool.Fachbereich.L.Key});
      this.Auswahlliste.push({Index: 5, FirstColumn: this.Pool.Fachbereich.S.Bezeichnung,              SecoundColumn: this.Pool.Fachbereich.S.Kuerzel,              Data: this.Pool.Fachbereich.S.Key});
      this.Auswahlliste.push({Index: 6, FirstColumn: this.Pool.Fachbereich.K.Bezeichnung,              SecoundColumn: this.Pool.Fachbereich.K.Kuerzel,              Data: this.Pool.Fachbereich.K.Key});
      this.Auswahlliste.push({Index: 7, FirstColumn: this.Pool.Fachbereich.MSR.Bezeichnung,            SecoundColumn: this.Pool.Fachbereich.MSR.Kuerzel,            Data: this.Pool.Fachbereich.MSR.Key});

      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data: this.DB.CurrentMitarbeiter.Fachbereich} );

      if(this.Auswahlindex === -1) this.Auswahlindex = 0;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Mitarbeiterliste', 'StandortClickedHandler', this.Debug.Typen.Page);
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
}
