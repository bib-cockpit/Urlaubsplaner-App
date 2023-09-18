import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {DebugProvider} from "../../services/debug/debug";
import {DisplayService} from "../../services/diplay/display.service";
import {ConstProvider} from "../../services/const/const";
import * as lodash from "lodash-es";
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {DatabaseStandorteService} from "../../services/database-standorte/database-standorte.service";
import {DatabaseProjekteService} from "../../services/database-projekte/database-projekte.service";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";
import {Thumbnailstruktur} from "../../dataclasses/thumbnailstrucktur";

@Component({
  selector: 'pj-projekte-selectimages',
  templateUrl: './pj-projekte-selectimages.component.html',
  styleUrls: ['./pj-projete-selectimages.component.scss'],
})

export class PjProjeteSelectimagesComponent implements OnInit, OnDestroy, AfterViewInit {

  public Valid: boolean;

  @Output() CancelClickedEvent    = new EventEmitter<any>();
  @Output() OkClickedEvent        = new EventEmitter<Teamsfilesstruktur>();
  @Output() SelectedImagesChanged = new EventEmitter<Thumbnailstruktur[]>();


  @Input() Titel: string;
  @Input() Iconname: string;
  @Input() Dialogbreite: number;
  @Input() Dialoghoehe: number;
  @Input() PositionY: number;
  @Input() ZIndex: number;

  public CurrentIndex: number;

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

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bilderauswahl', 'constructor', this.Debug.Typen.Component);
    }
  }

  ngOnDestroy(): void {

      try {

        this.Displayservice.RemoveDialog(this.Displayservice.Dialognamen.Bilderauswahl);


      } catch (error) {

        this.Debug.ShowErrorMessage(error.message, 'Bilderauswahl', 'OnDestroy', this.Debug.Typen.Component);
      }

    }

  ngOnInit() {

    try {


      this.Displayservice.AddDialog(this.Displayservice.Dialognamen.Bilderauswahl, this.ZIndex);



      this.PrepareData();



    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bilderauswahl', 'OnInit', this.Debug.Typen.Component);
    }
  }


  ngAfterViewInit(): void {

    try {


    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bilderauswahl', 'AfterViewInit', this.Debug.Typen.Component);
    }
  }


  CancelButtonClicked() {

    this.CancelClickedEvent.emit();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bilderauswahl', 'CancelButtonClicked', this.Debug.Typen.Component);
    }
  }

  ContentClicked(event: MouseEvent) {

    event.preventDefault();
    event.stopPropagation();

    try {

    } catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'Bilderauswahl', 'ContentClicked', this.Debug.Typen.Component);
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

      this.OkClickedEvent.emit();

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'File Verzeichnis Auswahl', 'OkButtonClicked', this.Debug.Typen.Component);
    }
  }
}
