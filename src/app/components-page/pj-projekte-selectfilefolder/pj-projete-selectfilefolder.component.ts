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
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";

@Component({
  selector: 'pj-projekte-selectfilefolder',
  templateUrl: './pj-projekte-selectfilefolder.component.html',
  styleUrls: ['./pj-projete-selectfilefolder.component.scss'],
})

export class PjProjeteSelectfilefolderComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;

  @Output() CancelClickedEvent    = new EventEmitter<any>();
  @Output() OkClickedEvent        = new EventEmitter<Teamsfilesstruktur>();

  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;
  @Input() ShowFiles: boolean;
  @Input() SelectedDirectoryID: string;
  @Input() InitialDirectoryID: string;

  public CurrentIndex: number;
  private Directory: Teamsfilesstruktur;

  constructor(public Debug: DebugProvider,
              public Displayservice: DisplayService,
              public Const: ConstProvider,
              public  Pool: DatabasePoolService,
              public DBStandort: DatabaseStandorteService,
              public DBProjekte: DatabaseProjekteService) {
    try {

      this.Titel               = this.Const.NONE;
      this.Iconname            = 'folder';
      this.Dialogbreite        = 700;
      this.Dialoghoehe         = 300;
      this.PositionY           = 100;
      this.ZIndex              = 2000;
      this.CurrentIndex        = -1;
      this.ShowFiles           = true;
      this.SelectedDirectoryID = this.Const.NONE;
      this.Directory           = null;
      this.InitialDirectoryID  = null;

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'File VErzeichnis Auswahl', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Verzeichnisauswahl);


      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'File VErzeichnis Auswahl', 'OnDestroy', this.Debug.Typen.Component);
      }

    }

  ngOnInit() {

    try {


      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Verzeichnisauswahl, this.ZIndex);



      this.PrepareData();



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'File VErzeichnis Auswahl', 'OnInit', this.Debug.Typen.Component);
    }
  }


  ngAfterViewInit(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'File VErzeichnis Auswahl', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'File VErzeichnis Auswahl', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'File VErzeichnis Auswahl', 'ContentClicked', this.Debug.Typen.Component);
    }
  }

  private PrepareData() {

    try {




    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'File Verzeichnis Auswahl', 'PrepareData', this.Debug.Typen.Component);
    }
  }

  OkButtonClicked() {

    try {

      this.OkClickedEvent.emit(this.Directory);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'File Verzeichnis Auswahl', 'OkButtonClicked', this.Debug.Typen.Page);
    }
  }

  DirectorySelectedHandler(dir: Teamsfilesstruktur) {

    try {

      if(dir !== null) this.SelectedDirectoryID = dir.id;
      else             this.SelectedDirectoryID = this.Const.NONE;

      this.Directory = dir;

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'File Verzeichnis Auswahl', 'DirectorySelectedHandler', this.Debug.Typen.Page);
    }

  }
}
