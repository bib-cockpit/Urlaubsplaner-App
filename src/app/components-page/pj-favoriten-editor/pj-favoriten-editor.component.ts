import {
  AfterViewInit,
  Component,
  EventEmitter, Input, OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {DisplayService} from "../../services/diplay/display.service";
import {ConstProvider} from "../../services/const/const";
import {Subscription} from "rxjs";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {Favoritenstruktur} from "../../dataclasses/favoritenstruktur";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";

@Component({
  selector: 'pj-favoriten-editor',
  templateUrl: './pj-favoriten-editor.component.html',
  styleUrls: ['./pj-favoriten-editor.component.scss'],
})

export class PjFavoritenEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;
  private JoiShema: ObjectSchema<Favoritenstruktur>;
  public Projektliste: Projektestruktur[];
  private ProjektlisteSubscription: Subscription;

  @Output() CancelClickedEvent    = new EventEmitter<any>();
  @Output() OkClickedEvent        = new EventEmitter<any>();
  @Output() EditProjektlisteEvent = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  constructor(public Debug: DebugProvider,
              public Displayservice: DisplayService,
              public Const: ConstProvider,
              private Pool: DatabasePoolService,
              public DBStandort: DatabaseStandorteService,
              public DBProjekte: DatabaseProjekteService) {
    try {

      this.Valid = true;
      this.Valid             = true;
      this.Titel             = this.Const.NONE;
      this.Iconname          = 'location-outline';
      this.Dialogbreite      = 400;
      this.Dialoghoehe       = 300;
      this.PositionY         = 100;
      this.ZIndex            = 2000;
      this.Projektliste      = [];

      this.ProjektlisteSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Favoriteneditor);

        if(this.ProjektlisteSubscription !== null) {

          this.ProjektlisteSubscription.unsubscribe();
          this.ProjektlisteSubscription = null;
        }

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Favoriten Editor', 'OnDestroy', this.Debug.Typen.Component);
      }

    }

  ngOnInit() {

    try {

      this.SetupValidation();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Favoriteneditor, this.ZIndex);

      this.ProjektlisteSubscription = this.DBProjekte.CurrentFavoritenChanged.subscribe(() => {



        this.PrepareData();
      });

      this.PrepareData();



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  private SetupValidation() {

    try {

      this.JoiShema = Joi.object<Favoritenstruktur>({

        Name:    Joi.string().required().max(100),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DBProjekte.CurrentFavorit);

      if(Result.error) {

        this.Valid = false;

        this.Debug.ShowErrorMessage(Result.error.message, 'Favoriten Editor', 'SetupValidation', this.Debug.Typen.Component);
      }
      else this.Valid = true;

      if(this.DBProjekte.CurrentFavorit.Projekteliste.length === 0) this.Valid = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    // this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    this.DBProjekte.SaveProjektefavoriten().then(() => {

      this.OkClickedEvent.emit();

    }).catch((error) => {

      debugger;
    });


    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  EditProjekteButtonClicked() {

    try {

      this.EditProjektlisteEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Editor', 'EditProjekteButtonClicked', this.Debug.Typen.Component);
    }
  }

  private PrepareData() {

    try {

      let Projekt: Projektestruktur;

      this.Projektliste = [];


      for(let currentid of this.DBProjekte.CurrentFavorit.Projekteliste) {

        Projekt = <Projektestruktur>lodash.find(this.Pool.Gesamtprojektliste, {_id: currentid});

        if(!lodash.isUndefined(Projekt)) this.Projektliste.push(Projekt);
      }

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Favoriten Editor', 'PrepareData', this.Debug.Typen.Component);
    }
  }
}
