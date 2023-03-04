import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {DatabaseProjektbeteiligteService} from "../../services/database-projektbeteiligte/database-projektbeteiligte.service";
import {DisplayService} from "../../services/diplay/display.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {ConstProvider} from "../../services/const/const";
import * as lodash from "lodash-es";
import { v4 as uuidv4 } from 'uuid';
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";

@Component({
  selector: 'pj-beteiligten-editor',
  templateUrl: './pj-beteiligten-editor.component.html',
  styleUrls: ['./pj-beteiligten-editor.component.scss'],
})
export class PjBeteiligtenEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();
  @Output() DeleteClickedEvent         = new EventEmitter<any>();
  @Output() FachbereichClickedEvent    = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  private JoiShema: ObjectSchema;
  public Valid: boolean;
  public DeleteEnabled: boolean;
  public CanDelete: boolean;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public DBProjekt: DatabaseProjekteService,
              public DBStandort: DatabaseStandorteService,
              public DBBeteiligte: DatabaseProjektbeteiligteService,
              public Displayservice: DisplayService,
              public Pool: DatabasePoolService,
              public Const: ConstProvider) {

    try {

      this.Valid             = true;
      this.DeleteEnabled     = false;
      this.Titel             = this.Const.NONE;
      this.Iconname          = 'help-circle-outline';
      this.Dialogbreite      = 400;
      this.Dialoghoehe       = 300;
      this.PositionY         = 100;
      this.ZIndex            = 3000;
      this.CanDelete         = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  private SetupValidation() {

    try {

      switch (this.DBBeteiligte.CurrentBeteiligte.Beteiligteneintragtyp) {

        case this.Const.Beteiligteneintragtypen.Person:

          this.JoiShema = Joi.object({

            Name:  Joi.string().required().max(100),
            Firma: Joi.string().required().max(100),

          }).options({ stripUnknown: true });

          break;

        case this.Const.Beteiligteneintragtypen.Firma:

          this.JoiShema = Joi.object({

            Firma: Joi.string().required().max(100),

          }).options({ stripUnknown: true });

          break;
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Beteiligteneditor, this.ZIndex);

      this.SetupValidation();
      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Beteiligteneditor);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  private PrepareData() {

    try {

      this.CanDelete = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'PrepareData', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      window.setTimeout( () => {

        this.ValidateInput();

      }, 30);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DBBeteiligte.CurrentBeteiligte);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  private ResetEditor() {

    try {

      this.DeleteEnabled = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'ResetEditor', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {


    try {

      this.ResetEditor();

      this.CancelClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    let Index: number;

    try {

      if(this.DBBeteiligte.CurrentBeteiligte.BeteiligtenID === null) {

        this.DBBeteiligte.CurrentBeteiligte.BeteiligtenID = uuidv4();

        this.DBProjekt.CurrentProjekt.Beteiligtenliste.push(this.DBBeteiligte.CurrentBeteiligte);
      }
      else {

        Index = lodash.findIndex(this.DBProjekt.CurrentProjekt.Beteiligtenliste, { BeteiligtenID: this.DBBeteiligte.CurrentBeteiligte.BeteiligtenID });

        if(Index !== -1) {

          this.DBProjekt.CurrentProjekt.Beteiligtenliste[Index] = this.DBBeteiligte.CurrentBeteiligte;
        }
      }

      this.DBBeteiligte.BeteiligtenlisteChanged.emit();

      this.OkClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {


    try {

      event.preventDefault();
      event.stopPropagation();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  BeteiligtetypChanged(event: any) {

    try {

      this.DBBeteiligte.CurrentBeteiligte.Beteiligteneintragtyp = event.detail.value;

      this.SetupValidation();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'BeteiligtetypChanged', this.Debug.Typen.Component);
    }
  }

  GeschlechtChanged(event: any) {

    try {

      this.DBBeteiligte.CurrentBeteiligte.Anrede = event.detail.value;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'GeschlechtChanged', this.Debug.Typen.Component);
    }
  }


  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  CanDeleteCheckedChanged(event: {status: boolean; index: number; event: any}) {

    try {

      this.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'CanDeleteCheckedChanged', this.Debug.Typen.Component);
    }
  }

  DeleteButtonClicked() {

    try {

      if(this.CanDelete) {

        this.DBProjekt.CurrentProjekt.Beteiligtenliste = lodash.filter(this.DBProjekt.CurrentProjekt.Beteiligtenliste, (eintrag: Projektbeteiligtestruktur) => {

          return eintrag.BeteiligtenID !== this.DBBeteiligte.CurrentBeteiligte.BeteiligtenID;
        });

        this.DBBeteiligte.BeteiligtenlisteChanged.emit();

        this.DeleteClickedEvent.emit();
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'DeleteButtonClicked', this.Debug.Typen.Component);
    }
  }
}
