import { Injectable } from '@angular/core';
import * as urlConfig from './url.config.json';
import * as dropDownConfig from './dropdown.config.json';
import * as rolesConfig from './roles.config.json';
import * as appConfig from './app.config.json';
import * as editorConfig from './editor.config.json';
import * as constants from './constants.json';
import * as offlineConfig from './offline.config.json';

/**
 * Service to fetch config details.
 *
 */
@Injectable()
export class DashletConfigService {

  constructor() {
    console.log('DashletsConfig Initialised', this);
  }
  /**
   * property containing url config
   *
   */
  urlConFig = (<any>urlConfig);
  /**
   * property containing drop down config
   *
   */
  dropDownConfig = (<any>dropDownConfig);
  /**
   * property containing roles config
   *
   */
  rolesConfig = (<any>rolesConfig);
  /**
   * property containing app config
   *
   */
  appConfig = (<any>appConfig);
  /**
  * property containing editor config
  *
  */
  editorConfig = (<any>editorConfig);

  /**
   * Constants to configure the app
   */
  constants = (<any>constants);
  /**
  * property containing offline application config
  *
  */
  offlineConfig = (<any>offlineConfig);
}

