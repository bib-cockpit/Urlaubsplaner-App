import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {ConstProvider} from "../../services/const/const";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {AlphabetComponent} from "../../components/alphabet/alphabet";
import * as lodash from "lodash-es";
import {DisplayService} from "../../services/diplay/display.service";
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";
import {DatabaseProjektbeteiligteService} from "../../services/database-projektbeteiligte/database-projektbeteiligte.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";

@Component({
  selector: 'pj-beteiligten-auswahl',
  templateUrl: './pj-beteiligten-auswahl.component.html',
  styleUrls: ['./pj-beteiligten-auswahl.component.scss'],
})
export class PjBeteiligtenAuswahlComponent implements OnInit, OnDestroy {

  @ViewChild('SmallAlphabet', { static: true })   Alphabetcomponent: AlphabetComponent;

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() AuswahlIDliste: string[];
  @Input() Multiselect: boolean;
  @Input() Dialogbreite: number;
  @Input() ZIndex: number;

  @Output() OkClickedEvent     = new EventEmitter<string[]>();
  @Output() CancelClickedEvent = new EventEmitter();

  public Anzeigeliste: Projektbeteiligtestruktur[];
  public Beteiligtebuchstabenliste: string[];
  public Standardalphabet: string[];
  public Beteiligtealphabet: string[];
  public Beteiligtealphabetauswahl: string;
  public Alphapetbreite: number;
  public Lastletter: string;
  public Beteiligtefiltertext: string;
  public Beteiligteliste: Projektbeteiligtestruktur[];
  public PositionY: number;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public DB: DatabaseProjektbeteiligteService,
              private DBProjekte: DatabaseProjekteService,
              public Const: ConstProvider,
              public Displayservice: DisplayService,
              private Pool: DatabasePoolService) {

    try {

      this.AuswahlIDliste              = [];
      this.Beteiligtebuchstabenliste  = [];
      this.Standardalphabet            = ['Alle', 'A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J', 'K','L', 'M', 'N', 'O', 'P', 'Q','R', 'S', 'T', 'U', 'V', 'W','X', 'Y', 'Z'];
      this.Beteiligtealphabetauswahl  = 'Alle';
      this.Beteiligtealphabet         = this.Standardalphabet;
      this.Alphapetbreite              = 44;
      this.Beteiligtefiltertext       = '';
      this.Multiselect                 = false;
      this.Titel                       = this.Const.NONE;
      this.Iconname                    = 'help-circle-outline';
      this.Dialogbreite                = 600;
      this.PositionY                   = 100;
      this.ZIndex                      = 3000;
      this.Beteiligteliste            = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Auswahl', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy() {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Beteiligteauswahl);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Auswahl', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      if(this.Alphabetcomponent) this.Alphabetcomponent.InitScreen();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Beteiligteauswahl, this.ZIndex);

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Auswahl', 'function', this.Debug.Typen.Component);
    }
  }

  private PrepareDaten() {

    try {

      let Liste:  Projektbeteiligtestruktur[];
      let Merker: Projektbeteiligtestruktur[];
      let Buchstabe: string;
      let Beteiligte: Projektbeteiligtestruktur;

      if(this.DBProjekte.CurrentProjekt !== null) {

        this.Lastletter = '';

        // Nach Name/Firma sortieren

        this.Beteiligteliste = lodash.cloneDeep(this.DBProjekte.CurrentProjekt.Beteiligtenliste);

        Liste = lodash.cloneDeep(this.DBProjekte.CurrentProjekt.Beteiligtenliste);

        for(Beteiligte of Liste) {

          Beteiligte.Sortvalue = Beteiligte.Name;

          /*

          if(Beteiligte.Beteiligteneintragtyp === this.Const.Beteiligteneintragtypen.Person) Beteiligte.Sortvalue = Beteiligte.Name;
          else                                                                               Beteiligte.Sortvalue = Beteiligte.Firma;

           */
        }

        Liste.sort( (a: Projektbeteiligtestruktur, b: Projektbeteiligtestruktur) => {

          if (a.Sortvalue < b.Sortvalue) return -1;
          if (a.Sortvalue > b.Sortvalue) return 1;
          return 0;
        });

        // Beteiligtealphabetauswahl Buchstaben festlegen

        if(Liste.length > 6) {

          this.Beteiligtealphabet = ['Alle'];

          for(let Eintrag of Liste) {

            Buchstabe = Eintrag.Sortvalue.substring(0, 1).toUpperCase();

            if(this.Beteiligtealphabet.indexOf(Buchstabe) === -1) this.Beteiligtealphabet.push(Buchstabe);
          }
        } else {

          this.Beteiligtealphabet = this.Standardalphabet;
        }

        // Alphabetfilter anwenden

        if(this.Beteiligtealphabetauswahl !== 'Alle') {

          Merker = lodash.cloneDeep(Liste);

          Liste = [];

          for(let Eintrag of Merker) {

            Buchstabe = Eintrag.Sortvalue.substring(0, 1).toUpperCase();

            Buchstabe = Buchstabe === 'Ä' ? 'A' : Buchstabe;
            Buchstabe = Buchstabe === 'Ö' ? 'O' : Buchstabe;
            Buchstabe = Buchstabe === 'Ü' ? 'U' : Buchstabe;

            if(this.Beteiligtealphabetauswahl === Buchstabe) Liste.push(Eintrag);
          }
        }

        // Buchstabenliste festlegen

        this.Beteiligtebuchstabenliste = [];

        for(let Eintrag of Liste) {

          this.Beteiligtebuchstabenliste.push(this.GetBeteiligteAlphabetbuchstabe(Eintrag));
        }

        // Alle Auswahlen entfernen

        for(Beteiligte of Liste) {

          Beteiligte.Selected = false;
        }

        // Auswahl festlegen

        for(let BeteiligteID of this.AuswahlIDliste) {

          Beteiligte = lodash.find(Liste, (beteiligter: Projektbeteiligtestruktur) => {

            return beteiligter.BeteiligtenID === BeteiligteID;
          });

          if(!lodash.isUndefined(Beteiligte)) Beteiligte.Selected = true;
        }

        this.Anzeigeliste = lodash.cloneDeep(Liste);
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Auswahl', 'PrepareDaten', this.Debug.Typen.Component);
    }
  }

  private GetBeteiligteAlphabetbuchstabe(value: Projektbeteiligtestruktur) {

    try {

      let Buchstabe: string = value.Sortvalue.substring(0, 1).toUpperCase();

      if(Buchstabe !== this.Lastletter) {

        this.Lastletter = Buchstabe;

        return Buchstabe;
      }
      else {

        return '';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Auswahl', 'GetBeteiligteAlphabetbuchstabe', this.Debug.Typen.Component);
    }
  }


  BeteiligteButtonClicked(Beteiligte: Projektbeteiligtestruktur) {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Auswahl', 'BeteiligteButtonClicked', this.Debug.Typen.Component);
    }
  }

  AlphabetClicked(buchstabe: string) {

    try {

      this.Beteiligtefiltertext       = '';
      this.Beteiligtealphabetauswahl  = buchstabe;

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Auswahl', 'AlphabetClicked', this.Debug.Typen.Component);
    }

  }

  CheckedChanged(result: { status: boolean; index: number; event: any }) {

    try {

      let Beteiligte: Projektbeteiligtestruktur;

      if(this.Multiselect === false) {

        for(Beteiligte of this.Beteiligteliste) {

          Beteiligte.Selected = false;
        }

        for(Beteiligte of this.Anzeigeliste) {

          Beteiligte.Selected = false;
        }
      }

      // Anpassung in der Gesamtliste

      Beteiligte = lodash.find(this.Beteiligteliste, { BeteiligtenID: this.Anzeigeliste[result.index].BeteiligtenID });

      if(!lodash.isUndefined(Beteiligte)) Beteiligte.Selected = result.status;

      // Anpassung in der Anzeigeliste

      this.Anzeigeliste[result.index].Selected = result.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Auswahl', 'CheckedChanged', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Auswahl', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    let IDListe: string[] = [];

    for(let Beteiligte of this.Anzeigeliste) {

      if(!lodash.isUndefined(Beteiligte.Selected) && Beteiligte.Selected === true) {

        IDListe.push(Beteiligte.BeteiligtenID);
      }
    }

    this.OkClickedEvent.emit(IDListe);

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Auswahl', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Auswahl', 'ContentClicked', this.Debug.Typen.Component);
    }
  }
}
