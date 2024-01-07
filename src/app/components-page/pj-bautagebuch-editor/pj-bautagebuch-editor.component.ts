import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output,} from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import * as lodash from "lodash-es";
import {DisplayService} from "../../services/diplay/display.service";
import {ConstProvider} from "../../services/const/const";
import {HttpErrorResponse} from "@angular/common/http";
import {ToolsProvider} from "../../services/tools/tools";
import * as Joi from "joi";
import {ObjectSchema} from "joi";
import {DatabaseBautagebuchService} from "../../services/database-bautagebuch/database-bautagebuch.service";
import moment, {Moment} from "moment";
import {BasicsProvider} from "../../services/basics/basics";
import {Bautagebucheintragstruktur} from "../../dataclasses/bautagebucheintragstruktur";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Subscription} from "rxjs";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Projektbeteiligtestruktur} from "../../dataclasses/projektbeteiligtestruktur";
import {Mitarbeiterstruktur} from "../../dataclasses/mitarbeiterstruktur";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {Thumbnailstruktur} from "../../dataclasses/thumbnailstrucktur";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";

@Component({
  selector: 'pj-bautagebuch-editor',
  templateUrl: './pj-bautagebuch-editor.component.html',
  styleUrls: ['./pj-bautagebuch-editor.component.scss'],
})

export class PjBautagebuchEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;
  public CanDelete: boolean;
  private JoiShema: ObjectSchema;
  public DeleteEnabled: boolean;
  public Headerhoehe: number;
  public LinesanzahlTeilnehmer: number;

  @Output() ValidChange = new EventEmitter<boolean>();
  @Output() CancelClickedEvent         = new EventEmitter<any>();
  @Output() OkClickedEvent             = new EventEmitter<any>();
  @Output() DeleteClickedEvent         = new EventEmitter<any>();
  @Output() AddTaetigkeiteintragEvent  = new EventEmitter<any>();
  @Output() EintragClickedEvent        = new EventEmitter<any>();
  @Output() BeteiligteteilnehmerClicked = new EventEmitter();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;
  private MitarbeiterSubscription: Subscription;
  public  Beteiligtenliste: Projektbeteiligtestruktur[][];
  public Mitarbeiterliste: Mitarbeiterstruktur[];

  constructor(public Debug: DebugProvider,
              public Displayservice: DisplayService,
              public Const: ConstProvider,
              private Tools: ToolsProvider,
              public Basics: BasicsProvider,
              public Pool: DatabasePoolService,
              public DBProjekte: DatabaseProjekteService,
              public DB: DatabaseBautagebuchService) {

    try {

      this.Valid = true;
      this.Valid             = true;
      this.Titel             = this.Const.NONE;
      this.Iconname          = 'book-outline';
      this.Dialogbreite      = 400;
      this.Dialoghoehe       = 300;
      this.LinesanzahlTeilnehmer    = 1;
      this.PositionY         = 100;
      this.ZIndex            = 2000;
      this.CanDelete         = false;
      this.DeleteEnabled     = false;
      this.Headerhoehe       = 30;
      this.Beteiligtenliste  = [];
      this.Mitarbeiterliste  = [];
      this.MitarbeiterSubscription = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.MitarbeiterSubscription.unsubscribe();

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Bautagebucheditor);

      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'OnDestroy', this.Debug.Typen.Component);
      }
  }

  private SetupValidation() {

    try {


      this.JoiShema = Joi.object({

        Auftraggeber:  Joi.string().required().max(100),
        Leistung:      Joi.string().required().min(5).max(200),
        Nummer:        Joi.string().required().min(1).max(4),
        Bezeichnung:   Joi.string().required().min(2).max(200),
        Temperatur:    Joi.string().required().min(1).max(2),

      }).options({ stripUnknown: true });


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'SetupValidation', this.Debug.Typen.Component);
    }
  }

  GetEmpfaengerInternChecked(id: string) {

    try {

      return lodash.indexOf(this.DB.CurrentTagebuch.EmpfaengerInternIDListe, id) !== -1;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'GetEmpfaengerInternChecked', this.Debug.Typen.Component);
    }
  }

  EmpfaengerInternCheckedChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      if(this.DB.CurrentTagebuch !== null) {

        if(event.status === true) {

          this.DB.CurrentTagebuch.EmpfaengerInternIDListe.push(event.value);
        }
        else {

          this.DB.CurrentTagebuch.EmpfaengerInternIDListe = lodash.filter(this.DB.CurrentTagebuch.EmpfaengerInternIDListe, (id: any) => {

            return id !== event.value;
          });
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'EmpfaengerInternCheckedChanged', this.Debug.Typen.Component);
    }
  }

  /*

  GetTeilnehmerInternChecked(FirmenID: string): boolean {

    try {

      return lodash.indexOf(this.DB.CurrentTagebuch.BeteiligtInternIDListe, FirmenID) !== -1;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'GetTeilnehmerInternChecked', this.Debug.Typen.Component);
    }
  }

   */

  GetEmpfaengerExternChecked(FirmenID: string): boolean {

    try {

      return lodash.indexOf(this.DB.CurrentTagebuch.EmpfaengerExternIDListe, FirmenID) !== -1;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'GetEmpfaengerExternChecked', this.Debug.Typen.Component);
    }
  }

  PrepareData() {

    try {

      let Index: number;
      let Beteiligteliste: Projektbeteiligtestruktur[];
      let Mitarbeiter: Mitarbeiterstruktur;

      this.Beteiligtenliste = [];
      this.Mitarbeiterliste = [];

      if(this.DB.CurrentTagebuch !== null && this.DBProjekte.CurrentProjekt !== null) {

        // Mitarbeiter und Beteiligte

        Index = 0;

        for (let Firma of this.DBProjekte.CurrentProjekt.Firmenliste) {

          this.Beteiligtenliste[Index] = [];

          Beteiligteliste = lodash.filter(this.DBProjekte.CurrentProjekt.Beteiligtenliste, {FirmaID: Firma.FirmenID});

          Beteiligteliste.sort((a: Projektbeteiligtestruktur, b: Projektbeteiligtestruktur) => {

            if (a.Name > b.Name) return -1;
            if (a.Name < b.Name) return 1;
            return 0;
          });

          this.Beteiligtenliste[Index] = Beteiligteliste;

          Index++;
        }

        for (let MitarbeiterID of this.DBProjekte.CurrentProjekt.MitarbeiterIDListe) {

          Mitarbeiter = lodash.find(this.Pool.Mitarbeiterliste, {_id: MitarbeiterID});

          if (!lodash.isUndefined(Mitarbeiter)) {

            this.Mitarbeiterliste.push(Mitarbeiter);
          }
        }

        this.Mitarbeiterliste.sort((a: Mitarbeiterstruktur, b: Mitarbeiterstruktur) => {

          if (a.Name > b.Name) return -1;
          if (a.Name < b.Name) return 1;
          return 0;
        });

        // Projektpunkte

        /*

        for(let id of this.DB.CurrentProtokoll.ProjektpunkteIDListe) {

          Projektpunkt = lodash.find(this.Pool.Projektpunkteliste[this.DBProjekte.CurrentProjekt.Projektkey], (punkt: Projektpunktestruktur) => {

            return punkt._id === id && punkt.ProtokollID === this.DB.CurrentProtokoll._id;
          });

          if(lodash.isUndefined(Projektpunkt) === false) {

            this.Punkteliste.push(Projektpunkt);
          }
        }

        this.Punkteliste.sort((a: Projektpunktestruktur, b: Projektpunktestruktur) => {

          if (a.Startzeitsptempel < b.Startzeitsptempel) return -1;
          if (a.Startzeitsptempel > b.Startzeitsptempel) return 1;
          return 0;
        });

        for(let Punkt of this.Punkteliste) {

          Punkt.Nummer     = Nummer.toString();
          Punkt.Sortnumber = Nummer;
          Nummer++;
        }

        this.Punkteliste.sort((a: Projektpunktestruktur, b: Projektpunktestruktur) => {

          if (a.Sortnumber > b.Sortnumber) return -1;
          if (a.Sortnumber < b.Sortnumber) return  1;
          return 0;
        });

        this.DBProjektpunkte.CurrentProjektpunkteliste = lodash.cloneDeep(this.Punkteliste);

        // Bilder

        this.Thumbnailliste = [];
        this.Thumbbreite    = 140;
        this.Spaltenanzahl  = 4;
        Punktindex          = 0;

        for(let Punkt of this.DBProjektpunkte.CurrentProjektpunkteliste) {

          Imageliste = [];

          for(let Bild of Punkt.Bilderliste) {

            File        = this.GraphService.GetEmptyTeamsfile();
            File.id     = Bild.FileID;
            File.webUrl = Bild.WebUrl;

            Imageliste.push(File);
          }

          Liste = [];

          for(File of Imageliste) {

            Thumb = await this.GraphService.GetSiteThumbnail(File);

            if(Thumb !== null) {

              Thumb.weburl = File.webUrl;
              Merker       = lodash.find(Liste, {id: File.id});

              if(lodash.isUndefined(Merker)) Liste.push(Thumb);
            }
            else {

              Thumb        = this.DBProjektpunkte.GetEmptyThumbnail();
              Thumb.id     = File.id;
              Thumb.weburl = null;

              Liste.push(Thumb);
            }
          }

          Anzahl                          = Liste.length;
          this.Zeilenanzahl               = Math.ceil(Anzahl / this.Spaltenanzahl);
          this.Thumbnailliste[Punktindex] = [];
          Index                           = 0;

          for(let Zeilenindex = 0; Zeilenindex < this.Zeilenanzahl; Zeilenindex++) {

            this.Thumbnailliste[Punktindex][Zeilenindex] = [];

            for(let Spaltenindex = 0; Spaltenindex < this.Spaltenanzahl; Spaltenindex++) {

              if(!lodash.isUndefined(Liste[Index])) {

                this.Thumbnailliste[Punktindex][Zeilenindex][Spaltenindex] = Liste[Index];
              }
              else {

                this.Thumbnailliste[Punktindex][Zeilenindex][Spaltenindex] = null;
              }

              Index++;
            }
          }

          Punktindex++;
        }

         */
      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'function', this.Debug.Typen.Component);
    }
  }

  /*

  TeilnehmerExternCheckedChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      if(this.DB.CurrentTagebuch !== null) {

        if(event.status === true) {

          this.DB.CurrentTagebuch.BeteiligtExternIDListe.push(event.value);
        }
        else {

          this.DB.CurrentTagebuch.BeteiligtExternIDListe = lodash.filter(this.DB.CurrentTagebuch.BeteiligtExternIDListe, (id: any) => {

            return id !== event.value;
          });
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'TeilnehmerExternCheckedChanged', this.Debug.Typen.Component);
    }
  }

   */

  EmpfaengerExternCheckedChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      if(this.DB.CurrentTagebuch !== null) {

        if(event.status === true) {

          this.DB.CurrentTagebuch.EmpfaengerExternIDListe.push(event.value);
        }
        else {

          this.DB.CurrentTagebuch.EmpfaengerExternIDListe = lodash.filter(this.DB.CurrentTagebuch.EmpfaengerExternIDListe, (id: any) => {

            return id !== event.value;
          });
        }
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'EmpfaengerExternCheckedChanged', this.Debug.Typen.Component);
    }
  }

  /*

  GetTeilnehmerExternChecked(FirmenID: string): boolean {

    try {

      return lodash.indexOf(this.DB.CurrentTagebuch.BeteiligtExternIDListe, FirmenID) !== -1;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'GetTeilnehmerExternChecked', this.Debug.Typen.Component);
    }
  }

   */

  TeilnehmerInternCheckedChanged(event: { status: boolean; index: number; event: any; value: string }) {

    try {

      if(this.DB.CurrentTagebuch !== null) {

        if(event.status === true) {

          this.DB.CurrentTagebuch.BeteiligtInternIDListe.push(event.value);
        }
        else {

          this.DB.CurrentTagebuch.BeteiligtInternIDListe = lodash.filter(this.DB.CurrentTagebuch.BeteiligtInternIDListe, (id: any) => {

            return id !== event.value;
          });
        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'TeilnehmerInternCheckedChanged', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.MitarbeiterSubscription = this.Pool.MitarbeiterAuswahlChanged.subscribe(() => {

        this.PrepareData();
      });

      this.PrepareData();
      this.SetupValidation();

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Bautagebucheditor, this.ZIndex);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  ValidateInput() {

    try {

      let Result = this.JoiShema.validate(this.DB.CurrentTagebuch);

      if(Result.error) this.Valid = false;
      else             this.Valid = true;

      this.ValidChange.emit(this.Valid);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'ValidateInput', this.Debug.Typen.Component);
    }
  }

  TextChanged(event: { Titel: string; Text: string; Valid: boolean }) {

    try {

      this.ValidateInput();

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'TextChanged', this.Debug.Typen.Component);
    }
  }

  ngAfterViewInit(): void {

    try {

      window.setTimeout( () => {

        this.ValidateInput();

        this.Titel = this.DB.CurrentTagebuch._id !== null ? 'Bautagebuch bearbeiten' : 'Neues Bautagebuch';

      }, 30);

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    // this.ResetEditor();

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  DeleteButtonClicked() {

    try {

      if(this.CanDelete) {

        this.DB.DeleteBautagebuch().then(() => {

          this.DeleteClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });

      }


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'DeleteButtonClicked', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      if(this.DB.CurrentTagebuch._id === null) {

        this.DB.AddBautagebuch().then((result: any) => {

          this.OkClickedEvent.emit();

        }).catch((error: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(error.error);

        });
      }
      else {

        this.DB.UpdateBautagebuch().then(() => {


          this.OkClickedEvent.emit();

        }).catch((exception: HttpErrorResponse) => {

          this.Tools.ShowHinweisDialog(exception.error.message);
        });
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  CanDeleteCheckedChanged(event: {status: boolean; index: number; event: any}) {

    try {

      this.CanDelete = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bautagebuch Editor', 'CanDeleteCheckedChanged', this.Debug.Typen.Component);
    }

  }

  DatumClicked() {

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'DatumClicked', this.Debug.Typen.Component);
    }
  }

  GetDatum(): Moment {

    try {

      if (this.DB.CurrentTagebuch !== null) return moment(this.DB.CurrentTagebuch.Zeitstempel);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'GetDatum', this.Debug.Typen.Component);
    }
  }

  RegenCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Regen = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'RegenCheckedChanged', this.Debug.Typen.Component);
    }
  }

  FrostCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Frost = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'FrostCheckedChanged', this.Debug.Typen.Component);
    }
  }

  SchneeCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Schnee = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'SchneeCheckedChanged', this.Debug.Typen.Component);
    }
  }
  WindCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Wind = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'SchneeCheckedChanged', this.Debug.Typen.Component);
    }
  }

  SonnigCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Sonnig = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'SonnigCheckedChanged', this.Debug.Typen.Component);
    }
  }

  BewoelktCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Bewoelkt = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'BewoelktCheckedChanged', this.Debug.Typen.Component);
    }
  }

  BedecktCheckedChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DB.CurrentTagebuch.Bewoelkt = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'BedecktCheckedChanged', this.Debug.Typen.Component);
    }
  }

  LoeschenCheckboxChanged(event: { status: boolean; index: number; event: any }) {

    try {

      this.DeleteEnabled = event.status;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'LoeschenCheckboxChanged', this.Debug.Typen.Component);
    }
  }

  public LoeschenButtonClicked() {

    try {

      this.DB.DeleteBautagebuch().then(() => {

        this.OkClickedEvent.emit();
      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'LoeschenButtonClicked', this.Debug.Typen.Component);
    }
  }

  AddTaetigkeitClicked() {

    try {

      this.DB.CurrentTagebucheintrag = this.DB.GetEmptyBautagebucheintrag();

      this.AddTaetigkeiteintragEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'AddTaetigkeitClicked', this.Debug.Typen.Component);
    }
  }

  BehinderungTextChanged(event: any) {

    try {

      if(!lodash.isUndefined(event.detail)) {

        this.DB.CurrentTagebuch.Behinderungen = event.detail.value !== null ? event.detail.value : '';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'BehinderungTextChanged', this.Debug.Typen.Component);
    }
  }

  VorkommnisseTextChanged(event: any) {

    try {

      if(!lodash.isUndefined(event.detail)) {

        this.DB.CurrentTagebuch.Vorkommnisse = event.detail.value !== null ? event.detail.value : '';
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'VorkommnisseTextChanged', this.Debug.Typen.Component);
    }
  }

  TagebucheintragClicked(Eintrag: Bautagebucheintragstruktur) {

    try {

      this.DB.CurrentTagebucheintrag = lodash.cloneDeep(Eintrag);
      this.EintragClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'TagebucheintragClicked', this.Debug.Typen.Component);
    }
  }

  DatumChangedHandler(zeitpunkt: moment.Moment) {

    try {

      this.DB.CurrentTagebuch.Zeitstempel = zeitpunkt.valueOf();
      this.DB.CurrentTagebuch.Zeitstring  = zeitpunkt.format('DD.MM.YYYY');

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'DatumChangedHandler', this.Debug.Typen.Component);
    }
  }

  GetInterneTeilnehmerliste(): string {

    try {

      let Liste: string[] = this.DB.GetInterneTeilnehmerliste();
      let html: string = '';

      for(let eintrag of Liste) {

        html += eintrag + '<br>';
      }

      return html;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Bautagebuch Editor', 'GetInterneTeilnehmerliste', this.Debug.Typen.Component);
    }

  }
}
