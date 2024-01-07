import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {BasicsProvider} from '../../services/basics/basics';
import {DebugProvider} from '../../services/debug/debug';
import {ConstProvider} from '../../services/const/const';
import {DatabasePoolService} from "../../services/database-pool/database-pool.service";
import {Teamsfilesstruktur} from "../../dataclasses/teamsfilesstruktur";
import {Graphservice} from "../../services/graph/graph";
import {ToolsProvider} from "../../services/tools/tools";
import * as lodash from "lodash-es";

@Component({
  selector: 'pj-sites-filebrowser',
  templateUrl: 'pj-sites-filebrowser.html',
  styleUrls: ['pj-sites-filebrowser.scss']
})
export class PjSitesFilebrowserComponent implements OnInit {

  @Input()  Browserbreite: number;
  @Input()  Browserhoehe: number;
  @Input()  ShowFiles: boolean;
  @Input()  ShowSelect: boolean;
  @Input()  SelectedDirectoryID: string;
  @Input()  InitialDirectoryID: string;


  @Output() DirectorySelected   = new EventEmitter<Teamsfilesstruktur>();
  @Output() PDFDownloadFinished = new EventEmitter<Teamsfilesstruktur>();
  @Output() PDFDownloadStarted  = new EventEmitter<Teamsfilesstruktur>();

  public Headerhoehe: number;
  public Contenthoehe: number;
  public SelectedDirectory: Teamsfilesstruktur;

  constructor(private Debug: DebugProvider,
              public Basics: BasicsProvider,
              public GraphService: Graphservice,
              public Pool: DatabasePoolService,
              public Const: ConstProvider) {

    try {

      this.Browserbreite       = 400;
      this.Browserhoehe        = 800;
      this.Headerhoehe         = 34;
      this.ShowFiles           = true;
      this.ShowSelect          = false;
      this.SelectedDirectoryID = this.Const.NONE;
      this.SelectedDirectory   = null;
      this.InitialDirectoryID  = null;

    }
    catch (error) {


      this.Debug.ShowErrorMessage(error.message,  'Sites Filebrowser', 'Construktor', this.Debug.Typen.Component);
    }
  }

  private async PrepareData() {

    try {

        let File: Teamsfilesstruktur;
        let Bigheaderhoehe: number = 52;

        this.Browserhoehe = this.Basics.Contenthoehe - 2 * Bigheaderhoehe;
        this.Contenthoehe = this.Browserhoehe - 1 * this.Headerhoehe;

        if(this.InitialDirectoryID === null || this.InitialDirectoryID === this.Const.NONE) {

          this.GraphService.GetSiteRootfilelist(this.ShowFiles);
        }
        else {

          File    = this.GraphService.GetEmptyTeamsfile();
          File.id = this.InitialDirectoryID;

          if(File.name === '') {

            File = await this.GraphService.GetSiteSubDirectory(File.id);
          }

          await this.GraphService.GetSiteSubdirictoryfilelist(File, true);

          let test = this.GraphService.TeamsSubdirectorylist;
        }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Sites Filebrowser', 'PrepareData', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {

      this.PrepareData();

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message,  'Sites Filebrowser', 'ngOnInit', this.Debug.Typen.Component);
    }
  }

  FolderClicked(File: Teamsfilesstruktur) {

    try {

      this.GraphService.GetSiteSubdirictoryfilelist(File, this.ShowFiles);

      this.SelectedDirectory   = null;
      this.SelectedDirectoryID = this.Const.NONE;

      this.DirectorySelected.emit(null);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Sites Filebrowser', 'FolderClicked', this.Debug.Typen.Component);
    }
  }

  RootFolderClicked() {

    try {

      this.GraphService.GetSiteRootfilelist(this.ShowFiles);

      this.SelectedDirectory   = null;
      this.SelectedDirectoryID = this.Const.NONE;

      this.DirectorySelected.emit(null);

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Sites Filebrowser', 'RootFolderClicked', this.Debug.Typen.Component);
    }
  }

  async SubFolderBackClicked(index: number, file: Teamsfilesstruktur) {

    try {

      if(index < this.GraphService.TeamsSubdirectorylist.length - 1) {

        await this.GraphService.GetSiteSubdirictoryfilelist(file, this.ShowFiles);
        await this.GraphService.RemoveSiteSubdirectory(file);

        this.SelectedDirectory   = null;
        this.SelectedDirectoryID = this.Const.NONE;

        this.DirectorySelected.emit(null);

      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Sites Filebrowser', 'SubFolderBackClicked', this.Debug.Typen.Component);
    }
  }

  async FileClicked(event: MouseEvent, file: Teamsfilesstruktur) {

    try {

      event.preventDefault();
      event.stopPropagation();

      console.log('File Clicked with id: ' + file.id);

      if(this.CheckFile(file) === true) {

        this.PDFDownloadStarted.emit(file);

        await this.GraphService.DownloadPDFSiteFile(file);

        this.PDFDownloadFinished.emit(file);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Sites Filebrowser', 'FileClicked', this.Debug.Typen.Component);
    }
  }

  CheckFile(fileitem: Teamsfilesstruktur): boolean {

    try {

      if(fileitem.file.mimeType === 'application/pdf') {

        return true;
      }
      else {

        return false;
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Sites Filebrowser', 'CheckFile', this.Debug.Typen.Component);
    }
  }

  FileSelectedChanged(event: any) {

    try {

      let id: string = event.detail.value;
      let File: Teamsfilesstruktur = lodash.find(this.GraphService.TeamsCurrentfilelist, {id: id});

      if(!lodash.isUndefined(File)) {

        this.SelectedDirectory = File;

        this.DirectorySelected.emit(this.SelectedDirectory);
      }

    } catch (error) {

      this.Debug.ShowErrorMessage(error, 'Sites Filebrowser', 'FileSelectedChanged', this.Debug.Typen.Component);
    }
  }
}
