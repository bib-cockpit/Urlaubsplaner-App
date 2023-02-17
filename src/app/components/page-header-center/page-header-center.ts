import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {BasicsProvider} from '../../services/basics/basics';
import {DebugProvider} from '../../services/debug/debug';
import {ConstProvider} from '../../services/const/const';
import {MenuController} from "@ionic/angular";

@Component({
  selector: 'page-header-center',
  templateUrl: 'page-header-center.html',
  styleUrls: ['page-header-center.scss']
})
export class PageHeaderCenterComponent implements OnInit {

  @ViewChild('PageHeaderDiv', { read: ElementRef, static: true }) public PageHeaderDiv: ElementRef;


  constructor(private Debug: DebugProvider,
              public Basics: BasicsProvider,
              public Const: ConstProvider,
              public menuCtrl: MenuController) {
    try {

    }
    catch (error) {


      this.Debug.ShowErrorMessage(error,  'Page Header', 'Construktor', this.Debug.Typen.Component);
    }
  }

  ngOnInit() {

    try {


    }
    catch (error) {

      this.Debug.ShowErrorMessage(error,  'Page Header', 'ngOnInit', this.Debug.Typen.Component);
    }
  }
}
