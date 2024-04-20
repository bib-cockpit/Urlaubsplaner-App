import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {ConstProvider} from "../../services/const/const";
import {AlphabetComponent} from "../../components/alphabet/alphabet";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Subscription} from "rxjs";
import {PageHeaderComponent} from "../../components/page-header/page-header";
import {PageFooterComponent} from "../../components/page-footer/page-footer";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import * as lodash from "lodash-es";
import {Auswahldialogstruktur} from "../../dataclasses/auswahldialogstruktur";
import {AuswahlDialogService} from "../../services/auswahl-dialog/auswahl-dialog.service";
import {DatabaseUrlaubService} from "../../services/database-urlaub/database-urlaub.service";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {SecurityService} from "../../services/security/security.service";

@Component({
  selector: 'fi-standorteliste-page',
  templateUrl: 'fi-standorteliste.html',
  styleUrls: ['fi-standorteliste.scss'],
})
export class FiStandortelistePage implements OnInit, OnDestroy{

  @ViewChild('Alphabet', { static: false })   Alphabetcomponent: AlphabetComponent;
  @ViewChild('PageHeader', { static: false }) PageHeader: PageHeaderComponent;
  @ViewChild('PageFooter', { static: false }) PageFooter: PageFooterComponent;

  public Standorteliste: Standortestruktur[];
  public Standortealphabet: string[];
  public Alphapetbreite: number;
  public Standortealphabetauswahl: string;
  public HideAuswahl: boolean;
  public Auswahlliste: Auswahldialogstruktur[];
  public Auswahlindex: number;
  public Auswahltitel: string;
  public Lastletter: string;
  public Standortebuchstabenliste: string[];
  public Standardalphabet: string[];
  public Zusatzbuttonliste: string[];
  public Standortefiltertext: string;
  public Standortefilter: string;
  public Inputtimer;
  public Listenbreite: number;
  public ShowEditor: boolean;
  public EditorValid: boolean;
  public ListeSubscription: Subscription;
  public ShowAuswahl: boolean;
  public Auswahlhoehe: number;
  public Auswahldialogorigin: string;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public Const: ConstProvider,
              public DB: DatabaseStandorteService,
              private Security: SecurityService,
              public DBMitarbeiter: DatabaseMitarbeiterService,
              private DBUrlaub: DatabaseUrlaubService,
              public Auswahlservice: AuswahlDialogService,
              public  Pool: DatabasePoolService) {
    try
    {
      this.Standardalphabet  = ['Alle', 'A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J', 'K','L', 'M', 'N', 'O', 'P', 'Q','R', 'S', 'T', 'U', 'V', 'W','X', 'Y', 'Z'];
      this.Standortealphabet    = [];
      this.Standortealphabetauswahl   = 'Alle';
      this.Standorteliste             = [];
      this.Zusatzbuttonliste =[];
      this.HideAuswahl       = true;
      this.Inputtimer        = null;
      this.Alphapetbreite    = 44;
      this.Standortefilter  = '';
      this.Standortealphabet    = this.Standardalphabet;
      this.Standortebuchstabenliste   = [];
      this.Listenbreite      = 0;
      this.ShowEditor        = false;
      this.EditorValid       = false;
      this.ListeSubscription = null;
      this.Auswahlliste         = [];
      this.Auswahlindex         = 0;
      this.Auswahltitel         = '';
      this.Auswahldialogorigin  = '';


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'constructor', this.Debug.Typen.Page);
    }
  }

  ngOnDestroy(): void {

    try {

      this.ListeSubscription.unsubscribe();

      this.ListeSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'OnDestroy', this.Debug.Typen.Page);
    }
  }

  ngOnInit(): void {

    try {

      this.ListeSubscription = this.Pool.StandortelisteChanged.subscribe(() => {

        this.PrepareDaten();
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'OnInit', this.Debug.Typen.Page);
    }
  }


  public ionViewDidEnter() {

    try {

      let Alphabetbreite: number = typeof this.Alphabetcomponent.Breite !== 'undefined' ? this.Alphabetcomponent.Breite : 40;

      this.Listenbreite = this.Basics.Contentbreite - Alphabetbreite - 4;

      this.PrepareDaten();

      this.Alphabetcomponent.InitScreen();
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'ionViewDidEnter', this.Debug.Typen.Page);
    }
  }

  ionViewDidLeave() {

    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'ionViewDidLeave', this.Debug.Typen.Page);
    }
  }

  StandortButtonClicked(eintrag: Standortestruktur) {

    try {

      this.DB.CurrentStandort = lodash.cloneDeep(eintrag);
      this.ShowEditor         = true;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'MitrabeiterButtonClicked', this.Debug.Typen.Page);
    }
  }

  AddStandorteButtonClicked() {

    try {

      this.DB.CurrentStandort = this.DB.GetEmptyStandort();

      this.ShowEditor = true;
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'AddStandorteButtonClicked', this.Debug.Typen.Page);
    }
  }

  AlphabetClicked(buchstabe: any) {

    try {

      this.Standortefiltertext       = '';
      this.Standortefilter           = '';
      this.Standortealphabetauswahl  = buchstabe;

      this.PrepareDaten();

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Standorteliste', 'AlphabetClicked', this.Debug.Typen.Page);
    }
  }

  private GetStandorteAlphabetbuchstabe(value: Standortestruktur) {

    try {

      let Buchstabe: string = value.Ort.substring(0, 1).toUpperCase();

      if(Buchstabe !== this.Lastletter) {

        this.Lastletter = Buchstabe;

        return Buchstabe;
      }
      else {

        return '';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'GetStandorteAlphabetbuchstabe', this.Debug.Typen.Page);
    }
  }


  private PrepareDaten() {

    try {

      let Liste:  Standortestruktur[];
      let Merker: Standortestruktur[];
      let Buchstabe: string;
      let Quelle: Standortestruktur[];
      let Laenge: number;
      let TeilA: string;
      let TeilB: string;
      let TeilC: string;
      let Teillaenge: number;
      let PosA: number;
      let Solltext: string;
      let Suchtext: string;


      if(this.Pool.Standorteliste !== null) {

        Quelle = lodash.cloneDeep(this.Pool.Standorteliste);

        this.Lastletter = '';

        // Nach Namen sortieren

        Liste = lodash.cloneDeep(Quelle);

        Liste.sort( (a: Standortestruktur, b: Standortestruktur) => {

          if (a.Ort < b.Ort) return -1;
          if (a.Ort > b.Ort) return 1;
          return 0;
        });

        // Standortfilter anwenden

        if(this.DB.CurrentStandortfilter !== null) {

          Merker = lodash.cloneDeep(Liste);
          Liste  = [];

          for(let Eintrag of Merker) {

            Liste.push(Eintrag);
          }
        }


        // Standortealphabetauswahl Buchstaben festlegen

        if(Liste.length > 6) {

          this.Standortealphabet = ['Alle'];

          for(let Eintrag of Liste) {

            Buchstabe = Eintrag.Ort.substring(0, 1).toUpperCase();

            if(this.Standortealphabet.indexOf(Buchstabe) === -1) this.Standortealphabet.push(Buchstabe);
          }
        } else {

          this.Standortealphabet = this.Standardalphabet;
        }

        // Alphabetfilter anwenden

        if(this.Standortealphabetauswahl !== 'Alle') {

          Merker = lodash.cloneDeep(Liste);

          Liste = [];

          for(let Eintrag of Merker) {

            Buchstabe = Eintrag.Ort.substring(0, 1).toUpperCase();

            if(this.Standortealphabetauswahl === Buchstabe) Liste.push(Eintrag);
          }
        }

        // Suche Standortefilter anwenden

        if(this.Standortefilter !== '') {

          Merker = lodash.cloneDeep(Liste);
          Liste  = [];

          for(let Eintrag of Merker) {

            Solltext = this.Standortefilter.toLowerCase();
            Suchtext = Eintrag.Ort.toLowerCase();
            PosA     = Suchtext.indexOf(Solltext);

            if(PosA !== -1) {

              Laenge     = Eintrag.Ort.length;
              Teillaenge = Solltext.length;
              TeilA      = Eintrag.Ort.substr(0, PosA);
              TeilB      = Eintrag.Ort.substr(PosA, Teillaenge);
              Teillaenge = Laenge - Teillaenge - PosA;
              TeilC      = Eintrag.Ort.substr(Laenge - Teillaenge, Teillaenge);

              Eintrag.Filtered = true;
              Eintrag.Text_A   = TeilA;
              Eintrag.Text_B   = TeilB;
              Eintrag.Text_C   = TeilC;

              Liste.push(Eintrag);
            }
          }
        }

        // Buchstabenliste festlegen

        this.Standortebuchstabenliste = [];

        for(let Eintrag of Liste) {

          this.Standortebuchstabenliste.push(this.GetStandorteAlphabetbuchstabe(Eintrag));
        }

        this.Standorteliste = lodash.cloneDeep(Liste);
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'PrepareDaten', this.Debug.Typen.Page);
    }
  }

  EditorValidChanged(event: boolean) {

    try {

      this.EditorValid = event;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'EditorValidChanged', this.Debug.Typen.Page);
    }
  }


  GetDialogTitel(): string {

    try {

      if(this.DB.CurrentStandort !== null) {

        return this.DB.CurrentStandort._id === null ? 'Neuen Standort anlegen' : 'Standort bearbeiten';
      }
      else {

        return 'Unbekannt';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'GetDialogTitel', this.Debug.Typen.Page);
    }
  }


  SucheChangedHandler(text: string) {

    try {

      this.Standortefiltertext = text;

      this.Standortefilter = this.Standortefiltertext;

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'SucheChangedHandler', this.Debug.Typen.Page);
    }

  }

  async AuswahlOkButtonClicked(data: any) {

    try {

      switch (this.Auswahldialogorigin) {

        case this.Auswahlservice.Auswahloriginvarianten.Standorteeditor_Land:


          this.DB.CurrentStandort.Land = data;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Standorteeditor_Bundesland:

          this.DB.CurrentStandort.Bundesland = data;

          break;

        case this.Auswahlservice.Auswahloriginvarianten.Standorteeditor_Konfession:

          this.DB.CurrentStandort.Konfession = data;

          break;
      }

      this.ShowAuswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Standorteliste', 'AuswahlOkButtonClicked', this.Debug.Typen.Page);
    }
  }

  LandClickedEventHandler() {


    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Standorteeditor_Land;

      this.Auswahltitel        = 'Land auswählen';
      this.Auswahlhoehe        = 600;
      this.ShowAuswahl         = true;

      this.Auswahlliste  = [];


      this.Auswahlliste.push({ Index: 0, FirstColumn: 'Deutschland', SecoundColumn: 'DE', Data: 'DE' });
      this.Auswahlliste.push({ Index: 1, FirstColumn: 'Bulgarien',   SecoundColumn: 'BG', Data: 'BG' });


      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data:this.DB.CurrentStandort.Land} );

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Standorteliste', 'LandClickedEventHandler', this.Debug.Typen.Page);
    }
  }

  BundeslandClickedEventHandler() {

    try {

      let Index: number = 0;

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Standorteeditor_Bundesland;

      this.Auswahltitel        = 'Bundesland auswählen';
      this.Auswahlhoehe        = 600;
      this.ShowAuswahl         = true;

      this.Auswahlliste  = [];

      for(let Region of this.DBUrlaub.Regionenliste) {

        this.Auswahlliste.push({ Index: Index, FirstColumn: Region.Name, SecoundColumn: Region.isoCode, Data: Region.isoCode });

        Index++;
      }

      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, {Data:this.DB.CurrentStandort.Bundesland} );

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Standorteliste', 'BundeslandClickedEventHandler', this.Debug.Typen.Page);
    }
  }

  KonfessionClickedEventHandler() {

    try {

      this.Auswahldialogorigin = this.Auswahlservice.Auswahloriginvarianten.Standorteeditor_Konfession;

      this.Auswahltitel  = 'Konfession auswählen';
      this.Auswahlhoehe  = 600;
      this.ShowAuswahl   = true;
      this.Auswahlliste  = [];

      this.Auswahlliste.push({ Index: 0, FirstColumn: 'Katholisch',  SecoundColumn: 'RK', Data: 'RK' });
      this.Auswahlliste.push({ Index: 1, FirstColumn: 'Evangelisch', SecoundColumn: 'EV', Data: 'EV' });

      this.Auswahlindex = lodash.findIndex(this.Auswahlliste, { Data:this.DB.CurrentStandort.Konfession });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Standorteliste', 'KonfessionClickedEventHandler', this.Debug.Typen.Page);
    }
  }

  CheckMitarbeiterIsStandortUrlaubsfreigabe(id: string, Standort: Standortestruktur): boolean {

    try {

      let Index: number = Standort.Urlaubfreigabepersonen.indexOf(id);

      return Index !== -1;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Standorteliste', 'CheckMitarbeiterIsStandortUrlaubsfreigabe', this.Debug.Typen.Page);
    }
  }

  CheckMitarbeiterIsStandortHomeofficefreigabe(id: string, Standort: Standortestruktur): boolean {

    try {

      let Index: number = Standort.Homeofficefreigabepersonen.indexOf(id);

      return Index !== -1;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Standorteliste', 'CheckMitarbeiterIsStandortHomeofficefreigabe', this.Debug.Typen.Page);
    }
  }
}
