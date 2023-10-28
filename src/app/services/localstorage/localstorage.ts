import { Injectable } from '@angular/core';
import {DebugProvider} from '../debug/debug';
import {BasicsProvider} from '../basics/basics';
import {ConstProvider} from '../const/const';
// import {Storage} from "@ionic/storage-angular";
import Cookies from 'js-cookie';


const Keys = {

  AccessToken: 'AccessToken',
};

@Injectable()
export class LocalstorageService {

  // public MyStorage: Storage;

  constructor(private Debug: DebugProvider,
              private Basics: BasicsProvider,
              // private Storageservice: Storage,
              private Const: ConstProvider) {
    try {

    }
    catch (error) {

      this.Debug.ShowErrorMessage(error.message, 'LocalstorageService', 'constructor', this.Debug.Typen.Service);
    }
  }
}
