import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {ConstProvider} from "../../services/const/const";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {AlphabetComponent} from "../../components/alphabet/alphabet";
import * as lodash from "lodash-es";
import {Subscription} from "rxjs";
import {Standortestruktur} from "../../dataclasses/standortestruktur";
import {DisplayService} from "../../services/diplay/display.service";

@Component({
  selector: 'fi-mitarbeiter-auswahl',
  templateUrl: './fi-mitarbeiter-auswahl.component.html',
  styleUrls: ['./fi-mitarbeiter-auswahl.component.scss'],
})
export class FiMitarbeiterAuswahlComponent implements OnInit, OnDestroy {

  @ViewChild('SmallAlphabet', { static: true })   Alphabetcomponent: AlphabetComponent;

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() AuswahlIDliste: string[];
  @Input() Multiselect: boolean;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  @Output() OkClickedEvent     = new EventEmitter<string[]>();
  @Output() CancelClickedEvent = new EventEmitter();
  @Output() StandortfilterClickedEvent = new EventEmitter<any>();

  public Anzeigeliste: Mitarbeiterstruktur[];
  public Mitarbeiterbuchstabenliste: string[];
  public Standardalphabet: string[];
  public Mitarbeiteralphabet: string[];
  public Mitarbeiteralphabetauswahl: string;
  public Alphapetbreite: number;
  public Lastletter: string;
  public Mitarbeiterfiltertext: string;
  public Mitarbeiterliste: Mitarbeiterstruktur[];
  private FilterSubscription: Subscription;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              private DB: DatabaseProjekteService,
              public DBStandort: DatabaseStandorteService,
              public Const: ConstProvider,
              public Displayservice: DisplayService,
              private Pool: DatabasePoolService) {

    try {

      this.AuswahlIDliste              = [];
      this.Mitarbeiterbuchstabenliste  = [];
      this.Standardalphabet            = ['Alle', 'A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J', 'K','L', 'M', 'N', 'O', 'P', 'Q','R', 'S', 'T', 'U', 'V', 'W','X', 'Y', 'Z'];
      this.Mitarbeiteralphabetauswahl  = 'Alle';
      this.Mitarbeiteralphabet         = this.Standardalphabet;
      this.Alphapetbreite              = 44;
      this.Mitarbeiterfiltertext       = '';
      this.Multiselect                 = false;
      this.Titel                       = this.Const.NONE;
      this.Iconname                    = 'help-circle-outline';
      this.Dialogbreite                = 400;
      this.Dialoghoehe                 = 300;
      this.PositionY                   = 100;
      this.ZIndex                      = 3000;
      this.Mitarbeiterliste            = [];
      this.FilterSubscription          = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy() {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Mitarbeiterauswahl);

      this.FilterSubscription.unsubscribe();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      if(this.Alphabetcomponent) this.Alphabetcomponent.InitScreen();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Mitarbeiterauswahl, this.ZIndex);

      this.FilterSubscription = this.DBStandort.StandortfilterChanged.subscribe(() => {

        this.PrepareDaten();
      });

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'function', this.Debug.Typen.Component);
    }
  }

  private PrepareDaten() {

    try {

      let Liste:  Mitarbeiterstruktur[];
      let Merker: Mitarbeiterstruktur[];
      let Buchstabe: string;
      let Laenge: number;
      let TeilA: string;
      let TeilB: string;
      let TeilC: string;
      let Teillaenge: number;
      let PosA: number;
      let Solltext: string;
      let Suchtext: string;
      let Mitarbeiter: Mitarbeiterstruktur;

      if(this.Pool.Mitarbeiterliste !== null) {

        this.Lastletter = '';

        // Nach Namen sortieren

        this.Mitarbeiterliste = lodash.cloneDeep(this.Pool.Mitarbeiterliste);

        Liste = lodash.cloneDeep(this.Pool.Mitarbeiterliste);

        Liste.sort( (a: Mitarbeiterstruktur, b: Mitarbeiterstruktur) => {

          if (a.Name < b.Name) return -1;
          if (a.Name > b.Name) return 1;
          return 0;
        });

        // Standort Filter anwenden

        if(this.DBStandort.MitarbeiterauswahlStandortfilter !== null) {

          Merker = lodash.cloneDeep(Liste);
          Liste  = [];

          for(let Eintrag of Merker) {

            if(Eintrag.StandortID === this.DBStandort.MitarbeiterauswahlStandortfilter._id) Liste.push(Eintrag);
          }
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

        // Alle Auswahlen entfernen

        for(Mitarbeiter of Liste) {

          Mitarbeiter.Selected = false;
        }

        // Auswahl festlegen

        for(let MitarbeiterID of this.AuswahlIDliste) {

          Mitarbeiter = lodash.find(Liste, {_id: MitarbeiterID});

          if(!lodash.isUndefined(Mitarbeiter)) Mitarbeiter.Selected = true;
        }

        this.Anzeigeliste = lodash.cloneDeep(Liste);
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'PrepareDaten', this.Debug.Typen.Component);
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

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'GetMitarbeiterAlphabetbuchstabe', this.Debug.Typen.Component);
    }
  }


  MitrabeiterButtonClicked(Mitarbeiter: Mitarbeiterstruktur) {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'MitrabeiterButtonClicked', this.Debug.Typen.Component);
    }
  }

  AlphabetClicked(buchstabe: string) {

    try {

      this.Mitarbeiterfiltertext       = '';
      this.Mitarbeiteralphabetauswahl  = buchstabe;

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'AlphabetClicked', this.Debug.Typen.Component);
    }

  }

  CheckedChanged(result: { status: boolean; index: number; event: any }) {

    try {

      let Mitarbeiter: Mitarbeiterstruktur;

      if(this.Multiselect === false) {

        for(Mitarbeiter of this.Mitarbeiterliste) {

          Mitarbeiter.Selected = false;
        }

        for(Mitarbeiter of this.Anzeigeliste) {

          Mitarbeiter.Selected = false;
        }
      }

      // Anpassung in der Gesamtliste

      Mitarbeiter = <Mitarbeiterstruktur>lodash.find(this.Mitarbeiterliste, {id: this.Anzeigeliste[result.index]._id});

      if(!lodash.isUndefined(Mitarbeiter)) Mitarbeiter.Selected = result.status;

      // Anpassung in der Anzeigeliste

      this.Anzeigeliste[result.index].Selected = result.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'CheckedChanged', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    let IDListe: string[] = [];

    for(let Mitarbeiter of this.Anzeigeliste) {

      if(!lodash.isUndefined(Mitarbeiter.Selected) && Mitarbeiter.Selected === true) {

        IDListe.push(Mitarbeiter._id);
      }
    }

    this.OkClickedEvent.emit(IDListe);

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'ContentClicked', this.Debug.Typen.Component);
    }
  }


  StandortfilterButtonClicked() {

    try {

      this.StandortfilterClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'StandortfilterButtonClicked', this.Debug.Typen.Component);
    }

  }

  GetStandortfiller(): string {

    try {

      if(this.DBStandort.MitarbeiterauswahlStandortfilter === null) return 'kein Standortfilter';
      else return this.DBStandort.MitarbeiterauswahlStandortfilter.Kuerzel + ' / ' + this.DBStandort.MitarbeiterauswahlStandortfilter.Standort;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Mitarbeiter Auswahl', 'GetStandortfiller', this.Debug.Typen.Component);
    }
  }
}
