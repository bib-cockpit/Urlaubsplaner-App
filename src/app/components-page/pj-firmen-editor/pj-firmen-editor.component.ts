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
import {DisplayService} from "../../services/diplay/display.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {ConstProvider} from "../../services/const/const";
import * as lodash from "lodash-es";
import { v4 as uuidv4 } from 'uuid';
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {DatabaseProjektfirmenService} from "../../services/database-projektfirmen/database-projektfirmen.service";
import {Projektfirmenstruktur} from "../../dataclasses/projektfirmenstruktur";

@Component({
  selector: 'pj-firmen-editor',
  templateUrl: './pj-firmen-editor.component.html',
  styleUrls: ['./pj-firmen-editor.component.scss'],
})
export class PjFirmenEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();
  @Output() DeleteClickedEvent         = new EventEmitter<any>();
  @Output() FachbereichClickedEvent    = new EventEmitter<any>();
  @Output() ProjektClickedEvent        = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;
  @Input() Projekt: Projektestruktur;

  private JoiShema: ObjectSchema;
  public Valid: boolean;
  public DeleteEnabled: boolean;
  public CanDelete: boolean;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public DBProjekt: DatabaseProjekteService,
              public DBStandort: DatabaseStandorteService,
              public DBFirma: DatabaseProjektfirmenService,
              public Displayservice: DisplayService,
              public Pool: DatabasePoolService,
              public Const: ConstProvider) {

    try {

      this.Valid             = true;
      this.DeleteEnabled     = false;
      this.Titel             = this.Const.NONE;
      this.Iconname          = 'help-circle-outline';
      this.Dialogbreite      = 400;
      this.PositionY         = 100;
      this.ZIndex            = 3000;
      this.CanDelete         = false;
      this.Projekt           = null;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  private SetupValidation() {

    try {

      this.JoiShema = Joi.object({

        Firma: Joi.string().required().max(100),

      }).options({ stripUnknown: true });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Firmeneditor, this.ZIndex);

      this.SetupValidation();
      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Firmeneditor);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  private async PrepareData() {

    try {



      this.CanDelete = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'PrepareData', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      window.setTimeout( () => {

        this.ValidateInput();

      }, 30);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DBFirma.CurrentFirma);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;

      if(this.Projekt === null) this.Valid = false;


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  private ResetEditor() {

    try {

      this.DeleteEnabled = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'ResetEditor', this.Debug.Typen.Component);
    }
  }

  CancelButtonClicked() {


    try {

      this.ResetEditor();

      this.CancelClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  async OkButtonClicked() {

    let Index: number;

    try {

      this.DBFirma.CurrentFirma.Email = this.DBFirma.CurrentFirma.Email.toLowerCase();

      if(this.Projekt !== null) {

        if(this.DBFirma.CurrentFirma.FirmenID === null) {

          this.DBFirma.CurrentFirma.FirmenID = uuidv4();

          this.Projekt.Firmenliste.push(this.DBFirma.CurrentFirma);
        }
        else {

          Index = lodash.findIndex(this.Projekt.Firmenliste, { FirmenID: this.DBFirma.CurrentFirma.FirmenID });

          if(Index !== -1) {

            this.Projekt.Firmenliste[Index] = this.DBFirma.CurrentFirma;
          }
        }

        debugger;

        await this.DBProjekt.UpdateProjekt(this.Projekt);

        this.DBFirma.FirmenlisteChanged.emit();

        this.OkClickedEvent.emit();
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {


    try {

      event.preventDefault();
      event.stopPropagation();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  BeteiligtetypChanged(event: any) {

    try {

      // this.DBBeteiligte.CurrentBeteiligte.Beteiligteneintragtyp = event.detail.value;

      this.SetupValidation();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'BeteiligtetypChanged', this.Debug.Typen.Component);
    }
  }


  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  CanDeleteCheckedChanged(event: {status: boolean; index: number; event: any}) {

    try {

      this.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'CanDeleteCheckedChanged', this.Debug.Typen.Component);
    }
  }

  DeleteButtonClicked() {

    try {

      if(this.CanDelete && this.Projekt !== null) {

        this.Projekt.Firmenliste = lodash.filter(this.Projekt.Firmenliste, (eintrag: Projektfirmenstruktur) => {

          return eintrag.FirmenID !== this.DBFirma.CurrentFirma.FirmenID;
        });

        this.DBFirma.FirmenlisteChanged.emit();

        this.DeleteClickedEvent.emit();
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Firmen Editor', 'DeleteButtonClicked', this.Debug.Typen.Component);
    }
  }
}
