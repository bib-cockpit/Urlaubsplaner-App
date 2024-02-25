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
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Projektfirmenstruktur} from "../../dataclasses/projektfirmenstruktur";
import {DatabaseProjektfirmenService} from "../../services/database-projektfirmen/database-projektfirmen.service";

@Component({
  selector: 'pj-firmen-auswahl',
  templateUrl: './pj-firmen-auswahl.component.html',
  styleUrls: ['./pj-firmen-auswahl.component.scss'],
})
export class PjFirmenAuswahlComponent implements OnInit, OnDestroy {

  @ViewChild('SmallAlphabet', { static: true })   Alphabetcomponent: AlphabetComponent;

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() AuswahlIDliste: string[];
  @Input() Multiselect: boolean;
  @Input() Dialogbreite: number;
  @Input() ZIndex: number;

  @Output() OkClickedEvent     = new EventEmitter<string[]>();
  @Output() CancelClickedEvent = new EventEmitter();

  public Anzeigeliste: Projektfirmenstruktur[];
  public Firmenbuchstabenliste: string[];
  public Standardalphabet: string[];
  public Firmenalphabet: string[];
  public Firmenalphabetauswahl: string;
  public Alphapetbreite: number;
  public Lastletter: string;
  public Firmenfiltertext: string;
  public Firmenliste: Projektfirmenstruktur[];
  public PositionY: number;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public DB: DatabaseProjektfirmenService,
              private DBProjekte: DatabaseProjekteService,
              public Const: ConstProvider,
              public Displayservice: DisplayService,
              private Pool: DatabasePoolService) {

    try {

      this.AuswahlIDliste              = [];
      this.Firmenbuchstabenliste  = [];
      this.Standardalphabet            = ['Alle', 'A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J', 'K','L', 'M', 'N', 'O', 'P', 'Q','R', 'S', 'T', 'U', 'V', 'W','X', 'Y', 'Z'];
      this.Firmenalphabetauswahl  = 'Alle';
      this.Firmenalphabet         = this.Standardalphabet;
      this.Alphapetbreite              = 44;
      this.Firmenfiltertext       = '';
      this.Multiselect                 = false;
      this.Titel                       = this.Const.NONE;
      this.Iconname                    = 'help-circle-outline';
      this.Dialogbreite                = 600;
      this.PositionY                   = 100;
      this.ZIndex                      = 3000;
      this.Firmenliste            = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Auswahl', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy() {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Firmenauswahl);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Auswahl', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      if(this.Alphabetcomponent) this.Alphabetcomponent.InitScreen();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Firmenauswahl, this.ZIndex);

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Auswahl', 'function', this.Debug.Typen.Component);
    }
  }

  private PrepareDaten() {

    try {

      let Liste:  Projektfirmenstruktur[];
      let Merker: Projektfirmenstruktur[];
      let Buchstabe: string;
      let Firmen: Projektfirmenstruktur;

      if(this.DBProjekte.CurrentProjekt !== null) {

        this.Lastletter = '';

        // Nach Name/Firma sortieren

        this.Firmenliste = lodash.cloneDeep(this.DBProjekte.CurrentProjekt.Firmenliste);

        Liste = lodash.cloneDeep(this.DBProjekte.CurrentProjekt.Firmenliste);



        Liste.sort( (a: Projektfirmenstruktur, b: Projektfirmenstruktur) => {

          if (a.Firma < b.Firma) return -1;
          if (a.Firma > b.Firma) return 1;
          return 0;
        });

        // Firmenalphabetauswahl Buchstaben festlegen

        if(Liste.length > 6) {

          this.Firmenalphabet = ['Alle'];

          for(let Eintrag of Liste) {

            Buchstabe = Eintrag.Sortvalue.substring(0, 1).toUpperCase();

            if(this.Firmenalphabet.indexOf(Buchstabe) === -1) this.Firmenalphabet.push(Buchstabe);
          }
        } else {

          this.Firmenalphabet = this.Standardalphabet;
        }

        // Alphabetfilter anwenden

        if(this.Firmenalphabetauswahl !== 'Alle') {

          Merker = lodash.cloneDeep(Liste);

          Liste = [];

          for(let Eintrag of Merker) {

            Buchstabe = Eintrag.Sortvalue.substring(0, 1).toUpperCase();

            Buchstabe = Buchstabe === 'Ä' ? 'A' : Buchstabe;
            Buchstabe = Buchstabe === 'Ö' ? 'O' : Buchstabe;
            Buchstabe = Buchstabe === 'Ü' ? 'U' : Buchstabe;

            if(this.Firmenalphabetauswahl === Buchstabe) Liste.push(Eintrag);
          }
        }

        // Buchstabenliste festlegen

        this.Firmenbuchstabenliste = [];

        for(let Eintrag of Liste) {

          this.Firmenbuchstabenliste.push(this.GetFirmenAlphabetbuchstabe(Eintrag));
        }

        // Alle Auswahlen entfernen

        for(Firmen of Liste) {

          Firmen.Selected = false;
        }

        // Auswahl festlegen

        for(let FirmenID of this.AuswahlIDliste) {

          Firmen = lodash.find(Liste, (firma: Projektfirmenstruktur) => {

            return firma.FirmenID === FirmenID;
          });

          if(!lodash.isUndefined(Firmen)) Firmen.Selected = true;
        }

        this.Anzeigeliste = lodash.cloneDeep(Liste);
      }
    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Auswahl', 'PrepareDaten', this.Debug.Typen.Component);
    }
  }

  private GetFirmenAlphabetbuchstabe(value: Projektfirmenstruktur) {

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

      this.Debug.ShowErrorMessage(error.message, 'Firmen Auswahl', 'GetFirmenAlphabetbuchstabe', this.Debug.Typen.Component);
    }
  }


  FirmenButtonClicked(Firmen: Projektfirmenstruktur) {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Auswahl', 'FirmenButtonClicked', this.Debug.Typen.Component);
    }
  }

  AlphabetClicked(buchstabe: string) {

    try {

      this.Firmenfiltertext       = '';
      this.Firmenalphabetauswahl  = buchstabe;

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Auswahl', 'AlphabetClicked', this.Debug.Typen.Component);
    }

  }

  CheckedChanged(result: { status: boolean; index: number; event: any }) {

    try {

      let Firmen: Projektfirmenstruktur;

      if(this.Multiselect === false) {

        for(Firmen of this.Firmenliste) {

          Firmen.Selected = false;
        }

        for(Firmen of this.Anzeigeliste) {

          Firmen.Selected = false;
        }
      }

      // Anpassung in der Gesamtliste

      Firmen = lodash.find(this.Firmenliste, { FirmenID : this.Anzeigeliste[result.index].FirmenID });

      if(!lodash.isUndefined(Firmen)) Firmen.Selected = result.status;

      // Anpassung in der Anzeigeliste

      this.Anzeigeliste[result.index].Selected = result.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Auswahl', 'CheckedChanged', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Auswahl', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    let IDListe: string[] = [];

    for(let Firmen of this.Anzeigeliste) {

      if(!lodash.isUndefined(Firmen.Selected) && Firmen.Selected === true) {

        IDListe.push(Firmen.FirmenID);
      }
    }

    this.OkClickedEvent.emit(IDListe);

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Auswahl', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Auswahl', 'ContentClicked', this.Debug.Typen.Component);
    }
  }
}
