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
import {EventObj} from "@tinymce/tinymce-angular/editor/Events";
import {navigate} from "ionicons/icons";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {DatabaseProjektfirmenService} from "../../services/database-projektfirmen/database-projektfirmen.service";
import {Projektfirmenstruktur} from "../../dataclasses/projektfirmenstruktur";
import {Subscription} from "rxjs";

@Component({
  selector: 'pj-beteiligten-editor',
  templateUrl: './pj-beteiligten-editor.component.html',
  styleUrls: ['./pj-beteiligten-editor.component.scss'],
})
export class PjBeteiligtenEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();
  @Output() DeleteClickedEvent         = new EventEmitter<any>();
  @Output() FirmaClickedEvent          = new EventEmitter<any>();
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
  public Ablage: string;
  private DialogbreiteMerker: number;
  private Beteiligtensubscription: Subscription;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public DBProjekt: DatabaseProjekteService,
              public DBStandort: DatabaseStandorteService,
              public DBBeteiligte: DatabaseProjektbeteiligteService,
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
      this.DialogbreiteMerker = this.Dialogbreite;
      this.PositionY         = 100;
      this.ZIndex            = 3000;
      this.CanDelete         = false;
      this.Ablage            = '';
      this.Projekt           = null;
      this.Beteiligtensubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  NotizTextChangedHandler(event: EventObj<any>) {

    try {



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Beteiligten Editor', 'NotizTextChangedHandler', this.Debug.Typen.Component);
    }
  }

  private SetupValidation() {

    try {

      this.JoiShema = Joi.object({

        Name:  Joi.string().required().max(100),
        Email: Joi.string().required().max(250),

      }).options({ stripUnknown: true });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Beteiligteneditor, this.ZIndex);

      this.Beteiligtensubscription = this.Pool.CurrentBeteiligtenChanged.subscribe(() => {

        this.ValidateInput();
      });

      this.DialogbreiteMerker = this.Dialogbreite;

      this.SetupValidation();
      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Beteiligteneditor);

      this.Beteiligtensubscription.unsubscribe();
      this.Beteiligtensubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  private async PrepareData() {

    try {

      this.Ablage = await navigator.clipboard.readText();

      if(this.Ablage !== '' && this.DBBeteiligte.CurrentBeteiligte.BeteiligtenID === null) {

        this.Dialogbreite = this.Dialogbreite * 2;
        this.Ablage       = this.Tools.FormatLinebreaks(this.Ablage);
      }
      else {

        this.Ablage       = '';
        this.Dialogbreite = this.DialogbreiteMerker;
      }

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

      if(this.Projekt === null) this.Valid = false;
      if(this.DBBeteiligte.CurrentBeteiligte.FirmaID === null) this.Valid = false;


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

  async OkButtonClicked() {

    let Index: number;

    try {

      this.DBBeteiligte.CurrentBeteiligte.Email = this.DBBeteiligte.CurrentBeteiligte.Email.toLowerCase();

      if(this.Projekt !== null) {

        if(this.DBBeteiligte.CurrentBeteiligte.BeteiligtenID === null) {

          this.DBBeteiligte.CurrentBeteiligte.BeteiligtenID = uuidv4();

          this.Projekt.Beteiligtenliste.push(this.DBBeteiligte.CurrentBeteiligte);
        }
        else {

          Index = lodash.findIndex(this.Projekt.Beteiligtenliste, { BeteiligtenID: this.DBBeteiligte.CurrentBeteiligte.BeteiligtenID });

          if(Index !== -1) {

            this.Projekt.Beteiligtenliste[Index] = this.DBBeteiligte.CurrentBeteiligte;
          }
        }

        await this.DBProjekt.UpdateProjekt(this.Projekt);

        this.DBBeteiligte.BeteiligtenlisteChanged.emit();

        this.OkClickedEvent.emit();
      }

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

      // this.DBBeteiligte.CurrentBeteiligte.Beteiligteneintragtyp = event.detail.value;

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

      if(this.CanDelete && this.Projekt !== null) {

        this.Projekt.Beteiligtenliste = lodash.filter(this.Projekt.Beteiligtenliste, (eintrag: Projektbeteiligtestruktur) => {

          return eintrag.BeteiligtenID !== this.DBBeteiligte.CurrentBeteiligte.BeteiligtenID;
        });

        this.DBBeteiligte.BeteiligtenlisteChanged.emit();

        this.DeleteClickedEvent.emit();
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Beteiligten Editor', 'DeleteButtonClicked', this.Debug.Typen.Component);
    }
  }

  GetFirmanameByFirmaID(firmaid: string): string {

    try {

      let Firma: Projektfirmenstruktur;

      if(this.Projekt !== null) {

        Firma = lodash.find(this.Projekt.Firmenliste, {FirmenID: firmaid});

        if(lodash.isUndefined(Firma)) return 'unbekannt';
        else return Firma.Firma;
      }
      else return 'unbekannt';


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Beteiligten Editor', 'GetFirmanameByFirmaID', this.Debug.Typen.Component);
    }
  }

  async AblageLoeschenButtonClicked() {

    try {

      await navigator.clipboard.writeText('');

      this.PrepareData();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Beteiligten Editor', 'AblageLoeschenButtonClicked', this.Debug.Typen.Component);
    }
  }
}
