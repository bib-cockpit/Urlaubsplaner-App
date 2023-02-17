import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {ConstProvider} from "../../services/const/const";
import * as lodash from 'lodash-es';
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {DisplayService} from "../../services/diplay/display.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";
import {DatabaseProjektbeteiligteService} from "../../services/database-projektbeteiligte/database-projektbeteiligte.service";
import {DatabaseGebaeudestrukturService} from "../../services/database-gebaeudestruktur/database-gebaeudestruktur";
import {Bauteilstruktur} from "../../dataclasses/bauteilstruktur";
import {Geschossstruktur} from "../../dataclasses/geschossstruktur";
import {Raumstruktur} from "../../dataclasses/raumstruktur";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {Projektestruktur} from "../../dataclasses/projektestruktur";

@Component({
  selector: 'pj-projekt-editor',
  templateUrl: './pj-projekt-editor.component.html',
  styleUrls: ['./pj-projekt-editor.component.scss'],
})
export class PjProjektEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() StatusClickedEvent         = new EventEmitter<any>();
  @Output() StandortClickedEvent       = new EventEmitter<any>();
  @Output() ValidChangedEvent          = new EventEmitter<boolean>();
  @Output() AddBeteiligteClickedEvent  = new EventEmitter<any>();
  @Output() BeteiligteClickedEvend     = new EventEmitter<Projektbeteiligtestruktur>();

  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();
  @Output() StandortfilterClickedEvent = new EventEmitter<any>();
  @Output() StellvertreterClickedEvent = new EventEmitter<any>();
  @Output() ProjektleiterClickedEvent  = new EventEmitter<any>();
  @Output() EditBauteilClickedEvent    = new EventEmitter<Bauteilstruktur>();
  @Output() EditGeschossClickedEvent   = new EventEmitter<Geschossstruktur>();
  @Output() EditRaumClickedEvent       = new EventEmitter<Raumstruktur>();
  @Output() AddBauteilClickedEvent     = new EventEmitter<any>();
  @Output() AddGeschossClickedEvent    = new EventEmitter<any>();
  @Output() AddRaumClickedEvent        = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  public Bereiche = {

    Allgemein:        'Allgemein',
    Beteiligte:       'Beteiligte',
    Gebaeudestruktur: 'Gebaeudestruktur'
  };

  public Bereich: string;
  public Valid: boolean;
  public DeleteEnabled: boolean;
  public Beteiligtenliste: Projektbeteiligtestruktur[];
  public ShowRaumVerschieber: boolean;
  private PositionChanged: boolean;
  private BeteiligtenSubscription: Subscription;
  private JoiShema: ObjectSchema;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              private DB: DatabaseProjekteService,
              public DBMitarbeiter: DatabaseMitarbeiterService,
              public DBStandort: DatabaseStandorteService,
              public DBBeteiligte: DatabaseProjektbeteiligteService,
              public Displayservice: DisplayService,
              public Pool: DatabasePoolService,
              public DBGebaeude: DatabaseGebaeudestrukturService,
              public Const: ConstProvider) {
    try {

      this.Valid               = true;
      this.DeleteEnabled       = false;
      this.Titel               = this.Const.NONE;
      this.Iconname            = 'help-circle-outline';
      this.Dialogbreite        = 400;
      this.Dialoghoehe         = 300;
      this.PositionY           = 100;
      this.ZIndex              = 2000;
      this.Beteiligtenliste    = [];
      this.Bereich             = this.Bereiche.Allgemein;
      this.ShowRaumVerschieber = false;
      this.PositionChanged     = false;

      this.BeteiligtenSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Projekteditor);

      this.BeteiligtenSubscription.unsubscribe();
      this.BeteiligtenSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.BeteiligtenSubscription = this.DBBeteiligte.BeteiligtenlisteChanged.subscribe(() => {

        this.PrepareData();
      });

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Projekteditor, this.ZIndex);

      this.DBGebaeude.Init();

      this.SetupValidation();
      this.PrepareData();


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  private SetupValidation() {

    try {


      this.JoiShema = Joi.object<Projektestruktur>({

        Projektname:      Joi.string().required().max(100),
        Projektnummer:    Joi.string().required().max(20),
        Projektkurzname:  Joi.string().required().max(20),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  private PrepareData() {

    try {

      this.Beteiligtenliste = lodash.cloneDeep(this.DB.CurrentProjekt.Beteiligtenliste);

      this.Beteiligtenliste.sort( (a: Projektbeteiligtestruktur, b: Projektbeteiligtestruktur) => {

        if (a.Name < b.Name) return -1;
        if (a.Name > b.Name) return 1;

        return 0;
      });

      // Gebäudestruktur




    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'PrepareData', this.Debug.Typen.Page);
    }
  }

  ngAfterViewInit(): void {

    try {

      window.setTimeout( () => {

        this.ValidateInput();
        this.DBGebaeude.Init();

      }, 30);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentProjekt);
      let Projekt: Projektestruktur;

      if(Result.error) this.Valid = false;
      else             this.Valid = true;


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }



  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      let Projekt: Projektestruktur;
      let Kurzname: string;

      this.ValidateInput();

      if(event.Titel === 'Projektkurzname') {

        if(this.DB.CurrentProjekt._id === null) { // Nur Eingabe wenn Projekt neu ist

          Kurzname = event.Text.toUpperCase();
          Projekt  = lodash.find(this.Pool.Gesamtprojektliste, {Projektkurzname: Kurzname });

          if(!lodash.isUndefined(Projekt)) {

            this.Tools.ShowHinweisDialog('Der Projektkurzname ' + Kurzname + ' ist bereits vergeben.');

            this.Valid= false;
          }
          else {

            this.DB.CurrentProjekt.Projektkurzname = Kurzname;
          }
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  LoeschenCheckboxChanged(event: {status: boolean; index: number; event: any}) {

    try {

      this.DeleteEnabled = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'LoeschenCheckboxChanged', this.Debug.Typen.Component);
    }
  }

  private ResetEditor() {

    try {

      this.DeleteEnabled = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'ResetEditor', this.Debug.Typen.Component);
    }
  }

  StatusClicked() {

    try {

      this.StatusClickedEvent.emit();



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'StatusClicked', this.Debug.Typen.Component);
    }
  }

  LoeschenButtonClicked() {

    try {

      this.DB.DeleteProjekt().then(() => {

        this.ResetEditor();

        // this.ModalKeeper.DialogVisibleChange.emit(false);
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'LoeschenButtonClicked', this.Debug.Typen.Component);
    }
  }

  ProjektleiterClicked() {

    try {

      this.ProjektleiterClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'ProjektleiterClicked', this.Debug.Typen.Component);
    }
  }

  StellvertreterClicked() {

    try {

      this.StellvertreterClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'StellvertreterClicked', this.Debug.Typen.Component);
    }
  }

  StandortClicked() {

    try {

      this.StandortClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'StandortClicked', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {

    this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      delete this.DB.CurrentProjekt.__v;

      if(this.DB.CurrentProjekt._id === null) {

        this.DB.CurrentProjekt.Projektkey = this.DB.GenerateProjektkey(this.DB.CurrentProjekt);

        this.DB.AddProjekt().then((result: any) => {

          this.OkClickedEvent.emit();

        }).catch((error: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(error.error);

        });
      }
      else {

        this.DB.UpdateProjekt().then(() => {


          this.OkClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  StandortfilterButtonClicked() {

    try {

      this.StandortfilterClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'StandortfilterButtonClicked', this.Debug.Typen.Component);
    }
  }

  BeteiligteButtonClicked(Beteiligt: Projektbeteiligtestruktur) {

    try {

      this.BeteiligteClickedEvend.emit(Beteiligt);


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'BeteiligteButtonClicked', this.Debug.Typen.Component);
    }
  }

  AddBeteiligteButtonClicked() {

    try {

      this.AddBeteiligteClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'AddBeteiligteButtonClicked', this.Debug.Typen.Component);
    }
  }

  AllgemeinMenuButtonClicked() {

    try {

      this.Bereich = this.Bereiche.Allgemein;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'AllgemeinMenuButtonClicked', this.Debug.Typen.Page);
    }
  }

  BeteiligteMenuButtonClicked() {

    try {

      this.Bereich = this.Bereiche.Beteiligte;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'BeteiligteMenuButtonClicked', this.Debug.Typen.Page);
    }
  }

  StrukturMenuButtonClicked() {

    try {

      this.Bereich = this.Bereiche.Gebaeudestruktur;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'StrukturMenuButtonClicked', this.Debug.Typen.Page);
    }
  }

  BauteilIndexChanged(event: any) {

    try {



      this.DBGebaeude.CurrentBauteilindex = event.detail.value;
      this.DBGebaeude.CurrentBauteil      = this.DB.CurrentProjekt.Bauteilliste[this.DBGebaeude.CurrentBauteilindex];

      if(this.DBGebaeude.CurrentBauteil.Geschossliste.length > 0) {

        this.DBGebaeude.CurrentGeschossindex = 0;
        this.DBGebaeude.CurrentGeschoss      = this.DBGebaeude.CurrentBauteil.Geschossliste[this.DBGebaeude.CurrentGeschossindex];

        if(this.DBGebaeude.CurrentGeschoss.Raumliste.length === 0) {

          this.DBGebaeude.CurrentRaumindex     = null;
          this.DBGebaeude.CurrentRaum          = null;
        }
        else {

          this.DBGebaeude.CurrentRaumindex = 0;
          this.DBGebaeude.CurrentRaum      = this.DBGebaeude.CurrentGeschoss.Raumliste[this.DBGebaeude.CurrentRaumindex];
        }
      }
      else {

        this.DBGebaeude.CurrentGeschossindex = null;
        this.DBGebaeude.CurrentGeschoss      = null;

        this.DBGebaeude.CurrentRaumindex     = null;
        this.DBGebaeude.CurrentRaum          = null;
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'BauteilIndexChanged', this.Debug.Typen.Component);
    }
  }

  GeschossIndexChanged(event: any) {

    try {

      this.DBGebaeude.CurrentGeschossindex = event.detail.value;
      this.DBGebaeude.CurrentGeschoss      = this.DBGebaeude.CurrentBauteil.Geschossliste[this.DBGebaeude.CurrentGeschossindex];

      if(this.DBGebaeude.CurrentGeschoss.Raumliste.length === 0) {

        this.DBGebaeude.CurrentRaumindex     = null;
        this.DBGebaeude.CurrentRaum          = null;
      }
      else {

        this.DBGebaeude.CurrentRaumindex = 0;
        this.DBGebaeude.CurrentRaum      = this.DBGebaeude.CurrentGeschoss.Raumliste[this.DBGebaeude.CurrentRaumindex];
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'GeschossIndexChanged', this.Debug.Typen.Component);
    }
  }

  RaumUpButtonClicked(Raumindex) {

    try {

      let PositionA: number;
      let PositionB: number;

      if(Raumindex > 0) {

        PositionA = this.DBGebaeude.CurrentGeschoss.Raumliste[Raumindex - 1].Listenposition;
        PositionB = this.DBGebaeude.CurrentGeschoss.Raumliste[Raumindex].Listenposition;

        this.DBGebaeude.CurrentGeschoss.Raumliste[Raumindex - 1].Listenposition = PositionB;
        this.DBGebaeude.CurrentGeschoss.Raumliste[Raumindex].Listenposition     = PositionA;

        this.DBGebaeude.CurrentGeschoss.Raumliste.sort((a: Raumstruktur, b: Raumstruktur) => {

          if (a.Listenposition < b.Listenposition) return -1;
          if (a.Listenposition > b.Listenposition) return 1;
          return 0;
        });

        this.PositionChanged = true;
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'RaumUpButtonClicked', this.Debug.Typen.Component);
    }
  }

  RaumDownButtonClicked(Raumindex) {
    try {

      let PositionA: number;
      let PositionB: number;

      if(Raumindex < this.DBGebaeude.CurrentGeschoss.Raumliste.length - 1) {

        PositionA = this.DBGebaeude.CurrentGeschoss.Raumliste[Raumindex].Listenposition;
        PositionB = this.DBGebaeude.CurrentGeschoss.Raumliste[Raumindex + 1].Listenposition;

        this.DBGebaeude.CurrentGeschoss.Raumliste[Raumindex].Listenposition     = PositionB;
        this.DBGebaeude.CurrentGeschoss.Raumliste[Raumindex + 1].Listenposition = PositionA;

        this.DBGebaeude.CurrentGeschoss.Raumliste.sort((a: Raumstruktur, b: Raumstruktur) => {

          if (a.Listenposition < b.Listenposition) return -1;
          if (a.Listenposition > b.Listenposition) return 1;
          return 0;
        });

        this.PositionChanged = true;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'RaumDownButtonClicked', this.Debug.Typen.Component);
    }
  }

  RaumVerschiebenCheckChanged() {

    try {

      this.ShowRaumVerschieber = !this.ShowRaumVerschieber;

      if(this.ShowRaumVerschieber === true) {

        this.PositionChanged = false;
      }
      else {

        if(this.PositionChanged === true) {

          // Speichern

          this.DBGebaeude.SaveBauteil();
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'RaumVerschiebenCheckChanged', this.Debug.Typen.Component);
    }
  }

  ProjektfarbeChangedHandler(event: any) {

    try {

      this.DB.CurrentProjekt.Projektfarbe = event.detail.value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Projekt Editor', 'ProjektfarbeChangedHandler', this.Debug.Typen.Component);
    }
  }
}
