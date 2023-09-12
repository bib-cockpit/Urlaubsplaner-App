import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {DisplayService} from "../../services/diplay/display.service";
import {ConstProvider} from "../../services/const/const";
import {HttpErrorResponse} from "@angular/common/http";
import {ToolsProvider} from "../../services/tools/tools";
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {DatabaseNotizenService} from "../../services/database-notizen/database-notizen.service";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Notizenkapitelabschnittstruktur} from "../../dataclasses/notizenkapitelabschnittstruktur";
import * as lodash from "lodash-es";

@Component({
  selector: 'pj-notizenkapitel-editor',
  templateUrl: './pj-notizenkapitel-editor.component.html',
  styleUrls: ['./pj-notizenkapitel-editor.component.scss'],
})

export class PjNotizenkapitelEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;
  public CanDelete: boolean;
  private JoiShema: ObjectSchema;

  @Output() ValidChange = new EventEmitter<boolean>();
  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();
  @Output() DeleteClickedEvent         = new EventEmitter<any>();

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
              public DB: DatabaseNotizenService) {
    try {

      this.Valid = true;
      this.Valid             = true;
      this.Titel             = this.Const.NONE;
      this.Iconname          = 'list-outline';
      this.Dialogbreite      = 400;
      this.Dialoghoehe       = 300;
      this.PositionY         = 200;
      this.ZIndex            = 2000;
      this.CanDelete         = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Notizenkapitel Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Notizenkapiteleditor);

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Notizenkapitel Editor', 'OnDestroy', this.Debug.Typen.Component);
      }
  }

  private SetupValidation() {

    try {


      this.JoiShema = Joi.object({

        Titel: Joi.string().required().max(100),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Notizenkapitel Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.SetupValidation();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Notizenkapiteleditor, this.ZIndex);

      if(this.DB.CurrentNotizenkapitel._id === null) this.Titel = 'Neues Kapitel erstellen';
      else this.Titel = 'Kapitel bearbeiten';

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Notizenkapitel Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentNotizenkapitel);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;

      this.ValidChange.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Notizenkapitel Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Notizenkapitel Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Notizenkapitel Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Notizenkapitel Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  DeleteButtonClicked() {

    try {

      if(this.CanDelete) {

        this.DB.DeleteNotizenkapitel(this.DB.CurrentNotizenkapitel).then(() => {

          this.DeleteClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });

      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Notizenkapitel Editor', 'DeleteButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      debugger;

      if(this.DB.CurrentNotizenkapitel._id === null) {

        this.DB.AddNotizenkapitel(this.DB.CurrentNotizenkapitel).then((result: any) => {

          this.OkClickedEvent.emit();

        }).catch((error: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(error.error);

        });
      }
      else {

        this.DB.UpdateNotizenkapitel(this.DB.CurrentNotizenkapitel, true).then(() => {


          this.OkClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Notizenkapitel Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Notizenkapitel Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  CanDeleteCheckedChanged(event: {status: boolean; index: number; event: any}) {

    try {

      this.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Notizenkapitel Editor', 'CanDeleteCheckedChanged', this.Debug.Typen.Component);
    }

  }

  AddAbschnittClicked() {

    try {

      let Abschnitt: Notizenkapitelabschnittstruktur = {

        KapitelabschnittID: this.Pool.GetNewUniqueID(),
        Titel:    '',
        HTML:     '',
        Filepath: ''
      };

      this.DB.CurrentNotizenkapitel.Abschnittliste.push(Abschnitt);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Notizenkapitel Editor', 'AddAbschnittClicked', this.Debug.Typen.Component);
    }
  }

  AbschnittTextChanged(event: {Titel: string; Text: string; Valid: boolean}, i: number) {

    try {



    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Notizenkapitel Editor', 'AbschnittTextChanged', this.Debug.Typen.Component);
    }
  }

  DeleteAbschnitt(KapitelabschnittID: string) {

    try {

      this.DB.CurrentNotizenkapitel.Abschnittliste = lodash.filter(this.DB.CurrentNotizenkapitel.Abschnittliste, (abschnitt: Notizenkapitelabschnittstruktur) => {

        return abschnitt.KapitelabschnittID !== KapitelabschnittID;
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Notizenkapitel Editor', 'DeleteAbschnitt', this.Debug.Typen.Component);
    }
  }
}
