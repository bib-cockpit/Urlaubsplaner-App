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
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {ConstProvider} from "../../services/const/const";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {AlphabetComponent} from "../../components/alphabet/alphabet";
import * as lodash from "lodash-es";
import {DisplayService} from "../../services/diplay/display.service";
import {Subscription} from "rxjs";
import {Projektestruktur} from "../../dataclasses/projektestruktur";

@Component({
  selector: 'pj-projekte-auswahl',
  templateUrl: './pj-projekte-auswahl.component.html',
  styleUrls: ['./pj-projekte-auswahl.component.scss'],
})
export class PjProjekteAuswahlComponent implements OnInit, OnDestroy {

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

  public Anzeigeliste: Projektestruktur[];
  public Projektebuchstabenliste: string[];
  public Standardalphabet: string[];
  public Projektealphabet: string[];
  public Projektealphabetauswahl: string;
  public Alphapetbreite: number;
  public Lastletter: string;
  public Projektefiltertext: string;
  public Projekteliste: Projektestruktur[];
  private StandortfilterSubsciption: Subscription;

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
      this.Projektebuchstabenliste     = [];
      this.Standardalphabet            = ['Alle', 'A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J', 'K','L', 'M', 'N', 'O', 'P', 'Q','R', 'S', 'T', 'U', 'V', 'W','X', 'Y', 'Z'];
      this.Projektealphabetauswahl     = 'Alle';
      this.Projektealphabet            = this.Standardalphabet;
      this.Alphapetbreite              = 44;
      this.Projektefiltertext          = '';
      this.Multiselect                 = false;
      this.Titel                       = this.Const.NONE;
      this.Iconname                    = 'help-circle-outline';
      this.Dialogbreite                = 400;
      this.Dialoghoehe                 = 300;
      this.PositionY                   = 100;
      this.ZIndex                      = 3000;
      this.Projekteliste               = [];
      this.StandortfilterSubsciption   = null;

      // Hello World

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekte Auswahl', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy() {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Projekteauswahl);

      if(this.StandortfilterSubsciption !== null) {

        this.StandortfilterSubsciption.unsubscribe();
        this.StandortfilterSubsciption = null;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekte Auswahl', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      if(this.Alphabetcomponent) this.Alphabetcomponent.InitScreen();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Projekteauswahl, this.ZIndex);

      this.StandortfilterSubsciption = this.DBStandort.StandortfilterChanged.subscribe(() => {

        this.PrepareDaten();
      });

      if(this.Pool.Gesamtprojektliste !== null) {

        this.Projekteliste = lodash.cloneDeep(this.Pool.Gesamtprojektliste);
      }
      else this.Projekteliste = [];

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekte Auswahl', 'function', this.Debug.Typen.Component);
    }
  }

  private PrepareDaten() {

    try {

      let Liste:  Projektestruktur[];
      let Merker: Projektestruktur[];
      let Buchstabe: string;
      let Laenge: number;
      let TeilA: string;
      let TeilB: string;
      let TeilC: string;
      let Teillaenge: number;
      let PosA: number;
      let Solltext: string;
      let Suchtext: string;
      let Projekte: Projektestruktur;

      Liste = lodash.cloneDeep(this.Pool.Gesamtprojektliste);

      // Nach Namen sortieren

      this.Lastletter = '';

      Liste.sort( (a: Projektestruktur, b: Projektestruktur) => {

        if (a.Projektname < b.Projektname) return -1;
        if (a.Projektname > b.Projektname) return 1;
        return 0;
      });

      // Standort Filter anwenden

      if(this.DBStandort.ProjekteauswahlStandortfilter !== null) {

        Merker = lodash.cloneDeep(Liste);
        Liste  = [];

        for(let Eintrag of Merker) {

          if(Eintrag.StandortID === this.DBStandort.ProjekteauswahlStandortfilter._id) Liste.push(Eintrag);
        }
      }

      // Projektealphabetauswahl Buchstaben festlegen

      if(Liste.length > 6) {

        this.Projektealphabet = ['Alle'];

        for(let Eintrag of Liste) {

          Buchstabe = Eintrag.Projektname.substring(0, 1).toUpperCase();

          if(this.Projektealphabet.indexOf(Buchstabe) === -1) this.Projektealphabet.push(Buchstabe);
        }
      } else {

        this.Projektealphabet = this.Standardalphabet;
      }

      // Alphabetfilter anwenden

      if(this.Projektealphabetauswahl !== 'Alle') {

        Merker = lodash.cloneDeep(Liste);

        Liste = [];

        for(let Eintrag of Merker) {

          Buchstabe = Eintrag.Projektname.substring(0, 1).toUpperCase();

          Buchstabe = Buchstabe === 'Ä' ? 'A' : Buchstabe;
          Buchstabe = Buchstabe === 'Ö' ? 'O' : Buchstabe;
          Buchstabe = Buchstabe === 'Ü' ? 'U' : Buchstabe;

          if(this.Projektealphabetauswahl === Buchstabe) Liste.push(Eintrag);
        }
      }

      // Suche Projektefilter anwenden

      if(this.Projektefiltertext !== '') {

        Merker = lodash.cloneDeep(Liste);
        Liste  = [];

        for(let Eintrag of Merker) {

          Solltext = this.Projektefiltertext.toLowerCase();
          Suchtext = Eintrag.Projektname.toLowerCase();
          PosA     = Suchtext.indexOf(Solltext);

          if(PosA !== -1) {

            Laenge     = Eintrag.Projektname.length;
            Teillaenge = Solltext.length;
            TeilA      = Eintrag.Projektname.substr(0, PosA);
            TeilB      = Eintrag.Projektname.substr(PosA, Teillaenge);
            Teillaenge = Laenge - Teillaenge - PosA;
            TeilC      = Eintrag.Projektname.substr(Laenge - Teillaenge, Teillaenge);

            Eintrag.Filtered = true;
            Eintrag.Text_A   = TeilA;
            Eintrag.Text_B   = TeilB;
            Eintrag.Text_C   = TeilC;

            Liste.push(Eintrag);
          }
        }
      }

      // Buchstabenliste festlegen

      this.Projektebuchstabenliste = [];

      for(let Eintrag of Liste) {

        this.Projektebuchstabenliste.push(this.GetProjekteAlphabetbuchstabe(Eintrag));
      }

      // Alle Auswahlen entfernen

      for(Projekte of Liste) {

        Projekte.Selected = false;
      }

      for(Projekte of this.Projekteliste) {

        Projekte.Selected = false;
      }

      // Auswahl festlegen

      for(let ProjekteID of this.AuswahlIDliste) {

        Projekte = <Projektestruktur>lodash.find(Liste, {_id: ProjekteID});

        if(!lodash.isUndefined(Projekte)) Projekte.Selected = true;

        Projekte = <Projektestruktur>lodash.find(this.Projekteliste, {_id: ProjekteID});

        if(!lodash.isUndefined(Projekte)) Projekte.Selected = true;
      }

      this.Anzeigeliste = lodash.cloneDeep(Liste);

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekte Auswahl', 'PrepareDaten', this.Debug.Typen.Component);
    }
  }

  private GetProjekteAlphabetbuchstabe(value: Projektestruktur) {

    try {

      let Buchstabe: string = value.Projektname.substring(0, 1).toUpperCase();

      if(Buchstabe !== this.Lastletter) {

        this.Lastletter = Buchstabe;

        return Buchstabe;
      }
      else {

        return '';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekte Auswahl', 'GetProjekteAlphabetbuchstabe', this.Debug.Typen.Component);
    }
  }

  AlphabetClicked(buchstabe: string) {

    try {

      this.Projektefiltertext       = '';
      this.Projektealphabetauswahl  = buchstabe;

      this.PrepareDaten();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekte Auswahl', 'AlphabetClicked', this.Debug.Typen.Component);
    }

  }

  CheckedChanged(result: { status: boolean; index: number; event: any }) {

    try {

      let Projekte: Projektestruktur;

      if(this.Multiselect === false) {

        for(Projekte of this.Projekteliste) {

          Projekte.Selected = false;
        }

        for(Projekte of this.Anzeigeliste) {

          Projekte.Selected = false;
        }
      }

      // Anpassung in der Gesamtliste

      Projekte = <Projektestruktur>lodash.find(this.Projekteliste, {_id: this.Anzeigeliste[result.index]._id});

      if(!lodash.isUndefined(Projekte)) Projekte.Selected = result.status;

      // Anpassung in der Anzeigeliste

      this.Anzeigeliste[result.index].Selected = result.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekte Auswahl', 'CheckedChanged', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekte Auswahl', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    let IDListe: string[] = [];

    for(let Projekte of this.Anzeigeliste) {

      if(!lodash.isUndefined(Projekte.Selected) && Projekte.Selected === true) {

        IDListe.push(Projekte._id);
      }
    }

    this.OkClickedEvent.emit(IDListe);

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekte Auswahl', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekte Auswahl', 'ContentClicked', this.Debug.Typen.Component);
    }
  }


  StandortfilterButtonClicked() {

    try {

      this.StandortfilterClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekte Auswahl', 'StandortfilterButtonClicked', this.Debug.Typen.Component);
    }

  }

  GetStandortfiller(): string {

    try {

      if(this.DBStandort.ProjekteauswahlStandortfilter === null) return 'kein Standortfilter';
      else return this.DBStandort.ProjekteauswahlStandortfilter.Kuerzel + ' / ' + this.DBStandort.ProjekteauswahlStandortfilter.Standort;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Projekte Auswahl', 'GetStandortfiller', this.Debug.Typen.Component);
    }
  }
}
