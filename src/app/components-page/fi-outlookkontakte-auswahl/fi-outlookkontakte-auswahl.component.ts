import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Outlookkontaktestruktur} from "../../dataclasses/outlookkontaktestruktur";
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {ConstProvider} from "../../services/const/const";
import {AlphabetComponent} from "../../components/alphabet/alphabet";
import * as lodash from "lodash-es";
import {Subscription} from "rxjs";
import {DisplayService} from "../../services/diplay/display.service";
import {LoadingAnimationService} from "../../services/loadinganimation/loadinganimation";
import {Graphservice} from "../../services/graph/graph";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {IonSearchbar} from "@ionic/angular";
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";

@Component({
  selector: 'fi-outlookkontakte-auswahl',
  templateUrl: './fi-outlookkontakte-auswahl.component.html',
  styleUrls: ['./fi-outlookkontakte-auswahl.component.scss'],
})
export class FiOutlookkontakteAuswahlComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('SmallAlphabet', { static: true })   Alphabetcomponent: AlphabetComponent;
  @ViewChild('Suchleiste', { static: false }) Suchleiste: IonSearchbar;

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;
  @Input() ExterneKontakteOnly: boolean;

  @Output() OkClickedEvent     = new EventEmitter<Projektbeteiligtestruktur[]>();
  @Output() CancelClickedEvent = new EventEmitter();
  @Output() StandortfilterClickedEvent = new EventEmitter<any>();

  private SuchleisteInputSubscription: Subscription;
  private SuchleisteClearSubscription: Subscription;
  public Inputtimer: any;
  public Anzeigeliste: Outlookkontaktestruktur[];
  public Kontaktbuchstabenliste: string[];
  public Standardalphabet: string[];
  public Kontaktalphabet: string[];
  public Kontaktalphabetauswahl: string;
  public Alphapetbreite: number;
  public Lastletter: string;
  public Kontaktfiltertext: string;
  public Kontakteliste: Outlookkontaktestruktur[];
  private FilterSubscription: Subscription;
  public Suchmodus: string;
  public Suchmodusvarianten = {

    Name: 'Name',
    Firma: 'Firma'
  };

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public Const: ConstProvider,
              public GraphService: Graphservice,
              public Displayservice: DisplayService,
              public LoadingAnimation: LoadingAnimationService) {

    try {

      this.Kontaktbuchstabenliste      = [];
      this.Standardalphabet            = ['Alle', 'A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J', 'K','L', 'M', 'N', 'O', 'P', 'Q','R', 'S', 'T', 'U', 'V', 'W','X', 'Y', 'Z'];
      this.Kontaktalphabetauswahl      = 'Alle';
      this.Kontaktalphabet             = this.Standardalphabet;
      this.Alphapetbreite              = 44;
      this.Kontaktfiltertext           = '';
      this.Titel                       = this.Const.NONE;
      this.Iconname                    = 'help-circle-outline';
      this.Dialogbreite                = 400;
      this.Dialoghoehe                 = 300;
      this.PositionY                   = 100;
      this.ZIndex                      = 3000;
      this.Kontakteliste               = [];
      this.FilterSubscription          = null;
      this.Anzeigeliste                = [];
      this.Suchmodus                   = this.Suchmodusvarianten.Name;
      this.Inputtimer                  = null;
      this.SuchleisteClearSubscription = null;
      this.SuchleisteInputSubscription = null;
      this.ExterneKontakteOnly         = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Outlook Kontakteauswahl', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit() {

    try {

      let Text: string;


      if(this.Suchleiste) { // Muss hier stehen / funktioniert in OnInit() nicht

        this.SuchleisteInputSubscription = this.Suchleiste.ionInput.subscribe((data: any) => {

          Text = data.target.value;

          if(this.Inputtimer !== null) {

            window.clearTimeout(this.Inputtimer);

            this.Inputtimer = null;
          }

          if(Text.length >= 3 || Text.length === 0) {

            this.Inputtimer = window.setTimeout(()  => {

              this.Kontaktfiltertext      = Text;
              this.Kontaktalphabetauswahl = 'Alle';

              this.PrepareDaten();

            }, 600);
          }

        });

        this.SuchleisteClearSubscription = this.Suchleiste.ionClear.subscribe(() => {

          this.Kontaktfiltertext      = '';
          this.Kontaktalphabetauswahl = 'Alle';

          this.PrepareDaten();
        });


      }
      else this.Suchleiste = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Outlook Kontakteauswahl', 'ngAfterViewInit', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy() {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Outlookkontakteauswahl);

      this.FilterSubscription.unsubscribe();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Outlook Kontakteauswahl', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      if(this.Alphabetcomponent) this.Alphabetcomponent.InitScreen();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Outlookkontakteauswahl, this.ZIndex);


      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Outlook Kontakteauswahl', 'function', this.Debug.Typen.Component);
    }
  }

  private async PrepareDaten() {

    try {

      let Liste:  Outlookkontaktestruktur[];
      let Merker: Outlookkontaktestruktur[];
      let Buchstabe: string;
      let Laenge: number;
      let TeilA: string;
      let TeilB: string;
      let TeilC: string;
      let Teillaenge: number;
      let PosA: number;
      let Solltext: string;
      let Suchtext: string;
      let Kontakt: Outlookkontaktestruktur;

      if(this.GraphService.Outlookkontakteliste.length === 0) {

        await this.LoadingAnimation.ShowLoadingAnimation('Hinweis', 'Outlook Kontakte werden geladen.');
        await this.GraphService.GetOwnOutlookcontacts(true);
        await this.LoadingAnimation.HideLoadingAnimation(true);
      }

      if(this.Kontakteliste.length === 0) this.Kontakteliste = lodash.cloneDeep(this.GraphService.Outlookkontakteliste);

      if(this.GraphService.Outlookkontakteliste !== null) {

        this.Lastletter = '';


        Liste = lodash.cloneDeep(this.GraphService.Outlookkontakteliste);

        // Filter anwenden

        if(this.ExterneKontakteOnly === true) {

          debugger;

          Liste = lodash.filter(Liste, (kontakt: Outlookkontaktestruktur) => {

            return kontakt.emailAddresses[0].address.indexOf('b-a-e.eu') === -1;

          });
        }

        // Nach Namen sortieren

        if(this.Suchmodus === this.Suchmodusvarianten.Name) {

          // Nach Namen filtern

          Liste.sort( (a: Outlookkontaktestruktur, b: Outlookkontaktestruktur) => {

            if (a.surname < b.surname) return -1;
            if (a.surname > b.surname) return 1;
            return 0;
          });

          // Kontaktalphabetauswahl Buchstaben festlegen

          if(Liste.length > 6) {

            this.Kontaktalphabet = ['Alle'];

            for(let Eintrag of Liste) {

              Buchstabe = Eintrag.surname.substring(0, 1).toUpperCase();

              if(this.Kontaktalphabet.indexOf(Buchstabe) === -1) this.Kontaktalphabet.push(Buchstabe);
            }
          } else {

            this.Kontaktalphabet = this.Standardalphabet;
          }

          // Alphabetfilter anwenden

          if(this.Kontaktalphabetauswahl !== 'Alle') {

            Merker = lodash.cloneDeep(Liste);

            Liste = [];

            for(let Eintrag of Merker) {

              Buchstabe = Eintrag.surname.substring(0, 1).toUpperCase();

              Buchstabe = Buchstabe === 'Ä' ? 'A' : Buchstabe;
              Buchstabe = Buchstabe === 'Ö' ? 'O' : Buchstabe;
              Buchstabe = Buchstabe === 'Ü' ? 'U' : Buchstabe;

              if(this.Kontaktalphabetauswahl === Buchstabe) Liste.push(Eintrag);
            }
          }

          // Suche Kontaktfilter anwenden

          if(this.Kontaktfiltertext !== '') {

            Merker = lodash.cloneDeep(Liste);
            Liste  = [];

            for(let Eintrag of Merker) {

              Solltext = this.Kontaktfiltertext.toLowerCase();
              Suchtext = Eintrag.surname.toLowerCase();
              PosA     = Suchtext.indexOf(Solltext);

              if(PosA !== -1) {

                Laenge     = Eintrag.surname.length;
                Teillaenge = Solltext.length;
                TeilA      = Eintrag.surname.substr(0, PosA);
                TeilB      = Eintrag.surname.substr(PosA, Teillaenge);
                Teillaenge = Laenge - Teillaenge - PosA;
                TeilC      = Eintrag.surname.substr(Laenge - Teillaenge, Teillaenge);

                Eintrag.Filtered = true;
                Eintrag.Text_A   = TeilA;
                Eintrag.Text_B   = TeilB;
                Eintrag.Text_C   = TeilC;

                Liste.push(Eintrag);
              }
            }
          }

          // Buchstabenliste festlegen

          this.Kontaktbuchstabenliste = [];

          for(let Eintrag of Liste) {

            this.Kontaktbuchstabenliste.push(this.GetKontaktAlphabetbuchstabe(Eintrag));
          }

          this.Anzeigeliste = lodash.cloneDeep(Liste);
        }
        else {

          // Nach Firmennamen filtern

          Liste = lodash.filter(Liste, (Eintrag: Outlookkontaktestruktur) => {

            return Eintrag.companyName !== '';
          });

          Liste.sort( (a: Outlookkontaktestruktur, b: Outlookkontaktestruktur) => {

            if (a.companyName < b.companyName) return -1;
            if (a.companyName > b.companyName) return 1;
            return 0;
          });

          // Kontaktalphabetauswahl Buchstaben festlegen

          if(Liste.length > 6) {

            this.Kontaktalphabet = ['Alle'];

            for(let Eintrag of Liste) {

              Buchstabe = Eintrag.companyName.substring(0, 1).toUpperCase();

              if(this.Kontaktalphabet.indexOf(Buchstabe) === -1) this.Kontaktalphabet.push(Buchstabe);
            }
          } else {

            this.Kontaktalphabet = this.Standardalphabet;
          }

          // Alphabetfilter anwenden

          if(this.Kontaktalphabetauswahl !== 'Alle') {

            Merker = lodash.cloneDeep(Liste);

            Liste = [];

            for(let Eintrag of Merker) {

              Buchstabe = Eintrag.companyName.substring(0, 1).toUpperCase();

              Buchstabe = Buchstabe === 'Ä' ? 'A' : Buchstabe;
              Buchstabe = Buchstabe === 'Ö' ? 'O' : Buchstabe;
              Buchstabe = Buchstabe === 'Ü' ? 'U' : Buchstabe;

              if(this.Kontaktalphabetauswahl === Buchstabe) Liste.push(Eintrag);
            }
          }

          // Suche Kontaktfilter anwenden

          if(this.Kontaktfiltertext !== '') {

            Merker = lodash.cloneDeep(Liste);
            Liste  = [];

            for(let Eintrag of Merker) {

              Solltext = this.Kontaktfiltertext.toLowerCase();
              Suchtext = Eintrag.companyName.toLowerCase();
              PosA     = Suchtext.indexOf(Solltext);

              if(PosA !== -1) {

                Laenge     = Eintrag.companyName.length;
                Teillaenge = Solltext.length;
                TeilA      = Eintrag.companyName.substr(0, PosA);
                TeilB      = Eintrag.companyName.substr(PosA, Teillaenge);
                Teillaenge = Laenge - Teillaenge - PosA;
                TeilC      = Eintrag.companyName.substr(Laenge - Teillaenge, Teillaenge);

                Eintrag.Filtered = true;
                Eintrag.Text_A   = TeilA;
                Eintrag.Text_B   = TeilB;
                Eintrag.Text_C   = TeilC;

                Liste.push(Eintrag);
              }
            }
          }

          // Buchstabenliste festlegen

          this.Kontaktbuchstabenliste = [];

          for(let Eintrag of Liste) {

            this.Kontaktbuchstabenliste.push(this.GetKontaktAlphabetbuchstabe(Eintrag));
          }

          this.Anzeigeliste = lodash.cloneDeep(Liste);
        }
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Outlook Kontakteauswahl', 'PrepareDaten', this.Debug.Typen.Component);
    }
  }

  private GetKontaktAlphabetbuchstabe(value: Outlookkontaktestruktur) {

    try {

      let Buchstabe: string = value.surname.substring(0, 1).toUpperCase();

      if(Buchstabe !== this.Lastletter) {

        this.Lastletter = Buchstabe;

        return Buchstabe;
      }
      else {

        return '';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Outlook Kontakteauswahl', 'GetKontaktAlphabetbuchstabe', this.Debug.Typen.Component);
    }
  }


  KontaktButtonClicked(Kontakt: Outlookkontaktestruktur) {

    try {



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Outlook Kontakteauswahl', 'KontaktButtonClicked', this.Debug.Typen.Component);
    }
  }

  AlphabetClicked(buchstabe: string) {

    try {

      this.Kontaktfiltertext       = '';
      this.Kontaktalphabetauswahl  = buchstabe;

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Outlook Kontakteauswahl', 'AlphabetClicked', this.Debug.Typen.Component);
    }

  }

  CancelButtonClicked() {

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Outlook Kontakteauswahl', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    let Liste: Projektbeteiligtestruktur[] = [];

    for(let Outlookkontakt of this.Kontakteliste) {

      if(Outlookkontakt.Selected === true) {

        Liste.push(this.GraphService.OutlookcontactToBeteiligte(Outlookkontakt));
      }
    }

    debugger;

    this.OkClickedEvent.emit(Liste);

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Outlook Kontakteauswahl', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Outlook Kontakteauswahl', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  CheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      let Kotakt: Outlookkontaktestruktur;


      // Anpassung in der Gesamtliste

      Kotakt = <Outlookkontaktestruktur>lodash.find(this.Kontakteliste, {id: this.Anzeigeliste[event.index].id});

      if(!lodash.isUndefined(Kotakt)) Kotakt.Selected = event.status;

      // Anpassung in der Anzeigeliste

      this.Anzeigeliste[event.index].Selected = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Outlook Kontakteauswahl', 'CheckedChanged', this.Debug.Typen.Component);
    }
  }

  SuchmodusChanged(event: any) {

    try {

      this.Suchmodus              = event.detail.value;
      this.Kontaktfiltertext      = '';
      this.Kontaktalphabetauswahl = 'Alle';

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Outlook Kontakteauswahl', 'SuchmodusChanged', this.Debug.Typen.Component);
    }
  }
}
