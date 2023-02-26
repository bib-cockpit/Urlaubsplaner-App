import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import {BasicsProvider} from "../../services/basics/basics";
import {DebugProvider} from "../../services/debug/debug";
import {ToolsProvider} from "../../services/tools/tools";
import {ConstProvider} from "../../services/const/const";
import {InputCloneComponent} from "../../components/input-clone/input-clone.component";
import * as lodash from 'lodash-es';
import {DisplayService} from "../../services/diplay/display.service";
import {DatabaseProjektpunkteService} from "../../services/database-projektpunkte/database-projektpunkte.service";
import {Kostengruppenstruktur} from "../../dataclasses/kostengruppenstruktur";
import {KostengruppenService} from "../../services/kostengruppen/kostengruppen.service";
import {DatabaseMitarbeiterService} from "../../services/database-mitarbeiter/database-mitarbeiter.service";
import {Meinewochestruktur} from "../../dataclasses/meinewochestruktur";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import moment from "moment";
import 'moment-duration-format';
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Projektpunktestruktur} from "../../dataclasses/projektpunktestruktur";
import {Projektestruktur} from "../../dataclasses/projektestruktur";
import {Projektfarbenstruktur} from "../../dataclasses/projektfarbenstruktur";

@Component({
  selector: 'pj-meinewoche-editor',
  templateUrl: './pj-meinewoche-editor.component.html',
  styleUrls: ['./pj-meinewoche-editor.component.scss'],
})
export class PjMeinewocheEditorComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('ContentDiv', { read: ElementRef, static: true }) public ContentDiv: ElementRef;

  @Output() CancelClickedEvent      = new EventEmitter<any>();
  @Output() OkClickedEvent          = new EventEmitter<any>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  public Oberkostengruppenliste: Kostengruppenstruktur[];
  public Hauptkostengruppenliste: Kostengruppenstruktur[];
  public Unterkostengruppenliste: Kostengruppenstruktur[];
  public ShowZeitansatzAuswahl: boolean;
  public Stundenansatz: number;
  public Minutenansatz: number;
  public ZeitansatzPosX: number;
  public Tagbreite: number;
  public CurrentTag: string;
  public ZeitansatzPosY: number;
  public Listenhoehe: number;
  // public Punkteliste: Projektpunktestruktur[][];
  private Minutenhoehe: number;

  constructor(public Basics: BasicsProvider,
              public Debug: DebugProvider,
              public Tools: ToolsProvider,
              public DB: DatabaseMitarbeiterService,
              public DBProjekte: DatabaseProjekteService,
              public DBProjektpunkte: DatabaseProjektpunkteService,
              public Displayservice: DisplayService,
              public Pool: DatabasePoolService,
              public Const: ConstProvider) {
    try {


      this.Titel = this.Const.NONE;
      this.Iconname = 'cash-outline';
      this.Dialogbreite = 400;
      this.Dialoghoehe = 300;
      this.PositionY = 100;
      this.ZIndex = 3000;
      this.ShowZeitansatzAuswahl = false;
      this.Stundenansatz = 0;
      this.Minutenansatz = 0;
      // this.Punkteliste   = [];

      this.Oberkostengruppenliste  = [];
      this.Hauptkostengruppenliste = [];
      this.Unterkostengruppenliste = [];

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

    try {

      this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Meinewocheeditor);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'OnDestroy', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Meinewocheeditor, this.ZIndex);

      this.Tagbreite    = (this.Dialogbreite - 20) / 5;
      this.Listenhoehe  = this.Dialoghoehe - 100;
      this.Minutenhoehe = this.Listenhoehe / (8 * 60);

      this.DBProjektpunkte.PrepareWochenpunkteliste();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'OnInit', this.Debug.Typen.Component);
    }
  }

  /*

  private PrepareData() {

    try {

      let Projektpunkt: Projektpunktestruktur;
      let Wochentagliste: string[] = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
      this.Punkteliste               = [];
      this.Punkteliste['Montag']     = [];
      this.Punkteliste['Dienstag']   = [];
      this.Punkteliste['Mittwoch']   = [];
      this.Punkteliste['Donnerstag'] = [];
      this.Punkteliste['Freitag']    = [];

      for(let Wocheneintrag of this.Pool.Mitarbeiterdaten.Meinewocheliste) {

        Projektpunkt = lodash.find(this.Pool.Projektpunkteliste[Wocheneintrag.Projektkey], {_id: Wocheneintrag.ProjektpunktID});

        if(lodash.isUndefined(Projektpunkt) === false && Projektpunkt.Status !== this.Const.Projektpunktstatustypen.Geschlossen.Name) {

          for(let Tag of Wochentagliste) {

            if(Wocheneintrag.Montagseinsatz === true && Tag === 'Montag') {

              Projektpunkt.Minuten = Wocheneintrag.Montagsminuten + 60 * Wocheneintrag.Montagsstunden;
              this.Punkteliste['Montag'].push(lodash.cloneDeep(Projektpunkt));
            }
            if(Wocheneintrag.Dienstagseinsatz === true && Tag === 'Dienstag') {

              Projektpunkt.Minuten = Wocheneintrag.Dienstagsminuten + 60 * Wocheneintrag.Dienstagsstunden;
              this.Punkteliste['Dienstag'].push(lodash.cloneDeep(Projektpunkt));
            }
            if(Wocheneintrag.Mittwochseinsatz  === true && Tag === 'Mittwoch') {

              Projektpunkt.Minuten = Wocheneintrag.Mittwochsminuten + 60 * Wocheneintrag.Mittwochsstunden;
              this.Punkteliste['Mittwoch'].push(lodash.cloneDeep(Projektpunkt));
            }
            if(Wocheneintrag.Donnerstagseinsatz === true && Tag === 'Donnerstag') {

              Projektpunkt.Minuten = Wocheneintrag.Donnerstagsminuten + 60 * Wocheneintrag.Donnerstagsstunden;
              this.Punkteliste['Donnerstag'].push(lodash.cloneDeep(Projektpunkt));
            }
            if(Wocheneintrag.Freitagseinsatz    === true && Tag === 'Freitag') {

              Projektpunkt.Minuten = Wocheneintrag.Freitagsminuten + 60 * Wocheneintrag.Freitagsstunden;
              this.Punkteliste['Freitag'].push(lodash.cloneDeep(Projektpunkt));
            }

          }

        }
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'PrepareData', this.Debug.Typen.Component);
    }
  }

   */

  ngAfterViewInit(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  TagCheckChangedHandler(event: { status: boolean; index: number; event: any }, tag: string) {

    try {

      if(this.DB.CurrentMeinewoche !== null) {

        this.CurrentTag = tag;

        switch (tag) {

          case 'Montag':

            this.DB.CurrentMeinewoche.Montagseinsatz = event.status;

            if(event.status === false) {

              this.DB.CurrentMeinewoche.Montagsminuten = 30;
              this.DB.CurrentMeinewoche.Montagsstunden = 0;
            }

          break;

          case 'Dienstag':

            this.DB.CurrentMeinewoche.Dienstagseinsatz = event.status;

            if(event.status === false) {

              this.DB.CurrentMeinewoche.Dienstagsminuten = 30;
              this.DB.CurrentMeinewoche.Dienstagsstunden = 0;
            }

          break;

          case 'Mittwoch':

            this.DB.CurrentMeinewoche.Mittwochseinsatz = event.status;

            if(event.status === false) {

              this.DB.CurrentMeinewoche.Mittwochsminuten = 30;
              this.DB.CurrentMeinewoche.Mittwochsstunden = 0;
            }

          break;

          case 'Donnerstag':

            this.DB.CurrentMeinewoche.Donnerstagseinsatz = event.status;

            if(event.status === false) {

              this.DB.CurrentMeinewoche.Donnerstagsminuten = 30;
              this.DB.CurrentMeinewoche.Donnerstagsstunden = 0;
            }

          break;

          case 'Freitag':

            this.DB.CurrentMeinewoche.Freitagseinsatz = event.status;

            if(event.status === false) {

              this.DB.CurrentMeinewoche.Freitagsminuten = 30;
              this.DB.CurrentMeinewoche.Freitagsstunden = 0;
            }

          break;

          case 'Samstag':

            this.DB.CurrentMeinewoche.Samstagseinsatz = event.status;

            if(event.status === false) {

              this.DB.CurrentMeinewoche.Samstagsminuten = 30;
              this.DB.CurrentMeinewoche.Samstagsstunden = 0;
            }

          break;
        }
      }

      this.DBProjektpunkte.PrepareWochenpunkteliste();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'TagCheckChangedHandler', this.Debug.Typen.Component);
    }
  }

  OkButtonClickedHandler() {

    try {

      let Eintrag: Meinewochestruktur = lodash.find(this.Pool.Mitarbeiterdaten.Meinewocheliste, (eintrag: Meinewochestruktur) => {

        return eintrag.ProjektID === this.DB.CurrentMeinewoche.ProjektID && eintrag.ProjektpunktID === this.DB.CurrentMeinewoche.ProjektpunktID;
      });


      Eintrag = this.DB.CurrentMeinewoche;

      if(!Eintrag.Montagseinsatz     && !Eintrag.Dienstagseinsatz && !Eintrag.Mittwochseinsatz &&
         !Eintrag.Donnerstagseinsatz && !Eintrag.Freitagseinsatz  && !Eintrag.Samstagseinsatz) {

        this.Pool.Mitarbeiterdaten.Meinewocheliste = lodash.filter(this.Pool.Mitarbeiterdaten.Meinewocheliste, (eintrag: Meinewochestruktur) => {

          return eintrag.ProjektpunktID !== Eintrag.ProjektpunktID;
        });
      }

      this.DB.UpdateMitarbeiter(this.Pool.Mitarbeiterdaten).then(() => {

        this.OkClickedEvent.emit();

      });

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'OkButtonClickedHandler', this.Debug.Typen.Component);
    }
  }

  ZeitansatzClicked(event: MouseEvent, tag: string) {

    try {

      let PagePosY: number = event.pageY;
      let Buttonhoehe: number = 20;
      let Dimension: DOMRect = this.ContentDiv.nativeElement.getBoundingClientRect();
      let DivPosY: number = Dimension.top;
      let OffsetY: number = event.offsetY;

      this.ShowZeitansatzAuswahl = true;
      this.ZeitansatzPosX        = 10;
      this.ZeitansatzPosY        = PagePosY - DivPosY - OffsetY + Buttonhoehe + 4;
      this.CurrentTag            = tag;

      switch (tag) {

        case 'Montag':

          this.DB.CurrentMeinewoche.Montagseinsatz = true;

          this.Stundenansatz = this.DB.CurrentMeinewoche.Montagsstunden;
          this.Minutenansatz = this.DB.CurrentMeinewoche.Montagsminuten;

          break;

        case 'Dienstag':

          this.DB.CurrentMeinewoche.Dienstagseinsatz = true;
          this.ZeitansatzPosX = this.ZeitansatzPosX + 1 * this.Tagbreite;

          this.Stundenansatz = this.DB.CurrentMeinewoche.Dienstagsstunden;
          this.Minutenansatz = this.DB.CurrentMeinewoche.Dienstagsminuten;

          break;

        case 'Mittwoch':

          this.DB.CurrentMeinewoche.Mittwochseinsatz = true;
          this.ZeitansatzPosX = this.ZeitansatzPosX + 2 * this.Tagbreite;

          this.Stundenansatz = this.DB.CurrentMeinewoche.Mittwochsstunden;
          this.Minutenansatz = this.DB.CurrentMeinewoche.Mittwochsminuten;

          break;

        case 'Donnerstag':

          this.DB.CurrentMeinewoche.Donnerstagseinsatz = true;
          this.ZeitansatzPosX = this.ZeitansatzPosX + 3 * this.Tagbreite;

          this.Stundenansatz = this.DB.CurrentMeinewoche.Donnerstagsstunden;
          this.Minutenansatz = this.DB.CurrentMeinewoche.Donnerstagsminuten;

          break;

        case 'Freitag':

          this.DB.CurrentMeinewoche.Freitagseinsatz = true;
          this.ZeitansatzPosX = this.ZeitansatzPosX + 4 * this.Tagbreite;

          this.Stundenansatz = this.DB.CurrentMeinewoche.Freitagsstunden;
          this.Minutenansatz = this.DB.CurrentMeinewoche.Freitagsminuten;

          break;

        case 'Samstag':

          this.DB.CurrentMeinewoche.Samstagseinsatz = true;
          this.ZeitansatzPosX = this.ZeitansatzPosX + 5 * this.Tagbreite;

          this.Stundenansatz = this.DB.CurrentMeinewoche.Samstagsstunden;
          this.Minutenansatz = this.DB.CurrentMeinewoche.Samstagsminuten;

          break;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'ZeitansatzClicked', this.Debug.Typen.Component);
    }
  }

  GetZeitansatzstring(stunden: number, minuten: number) : string {

    try {

      let Minutes: number = minuten + 60 * stunden;

      if(stunden === 0 && minuten === 0) {

        return '--:--';
      }
      else {

        return moment.duration(Minutes, "minutes").format('hh:mm', {trim: false});
      }
    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'GetZeitansatzstring', this.Debug.Typen.Component);
    }
  }

  ZeitansatzStundenChanged(event: any) {

    try {

      let Stunden: number = event.detail.value;

      switch (this.CurrentTag) {

        case 'Montag':

          this.DB.CurrentMeinewoche.Montagsstunden = Stunden;

          break;

        case 'Dienstag':

          this.DB.CurrentMeinewoche.Dienstagsstunden = Stunden;

          break;

        case 'Mittwoch':

          this.DB.CurrentMeinewoche.Mittwochsstunden = Stunden;

          break;

        case 'Donnerstag':

          this.DB.CurrentMeinewoche.Donnerstagsstunden = Stunden;

          break;

        case 'Freitag':

          this.DB.CurrentMeinewoche.Freitagsstunden = Stunden;

          break;

        case 'Samstag':

          this.DB.CurrentMeinewoche.Samstagsstunden = Stunden;

          break;
      }

      this.DBProjektpunkte.PrepareWochenpunkteliste();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'ZeitansatzStundenChanged', this.Debug.Typen.Component);
    }
  }

  ZeitansatzMinutenChanged(event: any) {

    try {

      let Minuten: number = parseInt(event.detail.value);

      switch (this.CurrentTag) {

        case 'Montag':

          this.DB.CurrentMeinewoche.Montagsminuten = Minuten;

          break;

        case 'Dienstag':

          this.DB.CurrentMeinewoche.Dienstagsminuten = Minuten;

          break;

        case 'Mittwoch':

          this.DB.CurrentMeinewoche.Mittwochsminuten = Minuten;

          break;

        case 'Donnerstag':

          this.DB.CurrentMeinewoche.Donnerstagsminuten = Minuten;

          break;

        case 'Freitag':

          this.DB.CurrentMeinewoche.Freitagsminuten = Minuten;

          break;

        case 'Samstag':

          this.DB.CurrentMeinewoche.Samstagsminuten = Minuten;

          break;
      }

      this.DBProjektpunkte.PrepareWochenpunkteliste();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'ZeitansatzMinutenChanged', this.Debug.Typen.Component);
    }
  }

  TimepickerOkButtonClickedHandler() {

    try {

      this.ShowZeitansatzAuswahl = false;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'TimepickerOkButtonClickedHandler', this.Debug.Typen.Component);
    }
  }

  GetProjektpunktFarbe(Punkt: Projektpunktestruktur): Projektfarbenstruktur {

    try {

      let Projekt: Projektestruktur = this.DBProjekte.GetProjektByID(Punkt.ProjektID);

      if(!lodash.isUndefined(Projekt) &&
        Projekt._id === this.DBProjekte.CurrentProjekt._id && this.DBProjektpunkte.CurrentProjektpunkt._id === Punkt._id) return this.DBProjekte.GetProjektfarbeByName(Projekt.Projektfarbe);
      else return {
        Background: "#444444",
        Foreground: "white",
        Name: ""
      };

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'GetProjektpunktBackground', this.Debug.Typen.Component);
    }
  }

  GetProjektpunthoehe(Punkt: Projektpunktestruktur): number {

    try {

      let Hoehe: number;

      Hoehe = Punkt.Minuten * this.Minutenhoehe;

      return Hoehe;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'GetProjektpunthoehe', this.Debug.Typen.Component);
    }
  }

  GetProjektpunktAufgabentext(Punkt: Projektpunktestruktur): string {

    try {

      let Projekt: Projektestruktur = this.DBProjekte.GetProjektByID(Punkt.ProjektID);

      let Text = Punkt.Aufgabe.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '<br />');

      return '<b>' + Projekt.Projektkurzname + ': </b>' + Text;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Meine Woche Editor', 'GetProjektpunktAufgabentext', this.Debug.Typen.Component);
    }
  }
}

