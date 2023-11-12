import {
  AfterViewInit,
  Component,
  EventEmitter, Input, OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {InputCloneComponent} from "../../components/input-clone/input-clone.component";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {DisplayService} from "../../services/diplay/display.service";
import {ConstProvider} from "../../services/const/const";
import {HttpErrorResponse} from "@angular/common/http";
import {ToolsProvider} from "../../services/tools/tools";
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {DatabaseFestlegungenService} from "../../services/database-festlegungen/database-festlegungen.service";
import {KostengruppenService} from "../../services/kostengruppen/kostengruppen.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'pj-festlegungskategorie-editor',
  templateUrl: './pj-festlegungskategorie-editor.component.html',
  styleUrls: ['./pj-festlegungskategorie-editor.component.scss'],
})

export class PjFestlegungskategorieEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;
  public CanDelete: boolean;
  private JoiShema: ObjectSchema;
  private KategorieSubscription: Subscription;

  @Output() ValidChange = new EventEmitter<boolean>();
  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();
  @Output() DeleteClickedEvent         = new EventEmitter<any>();
  @Output() KostengruppeClicked        = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  constructor(public Debug: DebugProvider,
              public Displayservice: DisplayService,
              public Const: ConstProvider,
              private Tools: ToolsProvider,
              private Pool: DatabasePoolService,
              public KostenService: KostengruppenService,
              public DB: DatabaseFestlegungenService) {
    try {

      this.Valid = true;
      this.Valid             = true;
      this.Titel             = this.Const.NONE;
      this.Iconname          = 'list-outline';
      this.Dialogbreite      = 600;
      this.Dialoghoehe       = 200;
      this.PositionY         = 100;
      this.ZIndex            = 2000;
      this.CanDelete         = false;
      this.KategorieSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungskategorie Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Festlegungkategorieneditor);

        this.KategorieSubscription.unsubscribe();
        this.KategorieSubscription = null;

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Festlegungskategorie Editor', 'OnDestroy', this.Debug.Typen.Component);
      }
  }

  private SetupValidation() {

    try {


      this.JoiShema = Joi.object({

        Beschreibung:  Joi.string().required().min(3).max(100).required(),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungskategorie Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Festlegungkategorieneditor, this.ZIndex);
      this.SetupValidation();

      if(this.DB.CurrentFestlegungskategorie._id === null) this.Titel = 'Neue Festlegungskategroie';
      else this.Titel = 'Festlegungskategroie bearbeiten';

      this.KategorieSubscription = this.Pool.CurrentFestlegungskategorieChanged.subscribe(() => {

        this.ValidateInput();
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungskategorie Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentFestlegungskategorie);
      let GoOn: boolean;

      if(Result.error) GoOn = false;
      else             GoOn = true;

      if(GoOn) {

        this.Valid = this.DB.CurrentFestlegungskategorie.Oberkostengruppe  !== null &&
                     this.DB.CurrentFestlegungskategorie.Unterkostengruppe !== null &&
                     this.DB.CurrentFestlegungskategorie.Hauptkostengruppe !== null;
      }
      else {

        this.Valid = false;
      }

      this.ValidChange.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungskategorie Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungskategorie Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungskategorie Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    // this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungskategorie Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  DeleteButtonClicked() {

    try {

      if(this.CanDelete) {

        this.DB.DeleteFestlegungskategorie().then(() => {

          this.DeleteClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });

      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungskategorie Editor', 'DeleteButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      if(this.DB.CurrentFestlegungskategorie._id === null) {

        this.DB.AddFestlegungskategorie().then((result: any) => {

          this.OkClickedEvent.emit();

        }).catch((error: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(error.error);

        });
      }
      else {

        this.DB.UpdateFestlegungskategorie().then(() => {


          this.OkClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungskategorie Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungskategorie Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  CanDeleteCheckedChanged(event: {status: boolean; index: number; event: any}) {

    try {

      this.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Festlegungskategorie Editor', 'CanDeleteCheckedChanged', this.Debug.Typen.Component);
    }

  }
}
