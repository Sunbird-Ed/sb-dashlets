import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { IReportType, InputParams, Properties, IGeoJSON, ICustomMapObj, ChartType, UpdateInputParams, StringObject, ReportState, IMapConfig, IDataService } from '../../types/index';
import { BaseComponent } from '../base/base.component';
import { DEFAULT_CONFIG as DEFAULT_CONFIG_TOKEN, DASHLET_CONSTANTS, DATA_SERVICE } from '../../tokens/index';
import { __defaultConfig } from './defaultConfiguration';
import { cloneDeep, toLower, find, groupBy, reduce } from 'lodash-es';
import * as geoJSONMapping from './geoJSONDataMapping.json'
import { catchError, pluck, retry, skipWhile, tap, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

declare var L;

/**
 * @dynamic
 */
@Component({
  selector: 'sb-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [
    {
      provide: DEFAULT_CONFIG_TOKEN,
      useValue: __defaultConfig
    }
  ]
})
export class MapComponent extends BaseComponent {

  public config: any;
  public reportType: IReportType = IReportType.CHART;
  public type: ChartType = ChartType.MAP;
  public _defaultConfig: object;
  public inputParameters: object = {};
  public exportOptions = ['csv'];

  private mappingConfig;
  private getGeoJSON = new BehaviorSubject(undefined);
  private mapClosure;

  @ViewChild('map') set mapContainer(element: ElementRef | null) {
    if (!element) return;
    if (this.inputParameters) {
      this.mapClosure = this._mapClosure(this.inputParameters);
      this.getGeoJSON.next({ ...this.inputParameters, reportData: this.data });
    }
  }

  constructor(@Inject(DATA_SERVICE) protected dataService: IDataService, @Inject(DEFAULT_CONFIG_TOKEN) defaultConfig: object, @Inject(DASHLET_CONSTANTS) private CONSTANTS: StringObject) {
    super(dataService);
    this.mappingConfig = (geoJSONMapping as any).default;
    this._defaultConfig = defaultConfig;
  }

  async initialize({ config, data, type = ChartType.MAP }: InputParams): Promise<any> {
    if (!(config && data)) throw new SyntaxError(this.CONSTANTS.INVALID_INPUT);
    this.config = config = { ...config, type };
    const fetchedJSON = this.data = await this.fetchData(data).toPromise().catch(err => []);
    this.builder(config, fetchedJSON);
    this._isInitialized = true;
    this.state.emit(ReportState.DONE);
  }

  private _setMapOptions(config: Partial<IMapConfig> = {}) {
    this.inputParameters = { ...this._defaultConfig, ...this.inputParameters, ...this.config, ...config };
    this.$context = { data: this.data, config: this.config, inputParameters: this.inputParameters, exportOptions: this.exportOptions };
  }

  private _mapClosure(config: Partial<IMapConfig> = {}) {
    const { initialCoordinate, initialZoomLevel, latBounds, lonBounds, mapId = this.id } = config;

    const map = L && L.map(mapId).setView(initialCoordinate, initialZoomLevel);

    const geoJSONLayer = map && (L && L.geoJSON(null, {
      style: this.setStyle.bind(this),
      onEachFeature: this.onEachFeature.bind(this)
    }));

    const maxBounds = L && L.latLngBounds([latBounds, lonBounds]);
    map.setMaxBounds(maxBounds);

    const { urlTemplate, options } = config.tileLayer;
    const controlObject = this.getControlObject();

    L && map && L.tileLayer(urlTemplate, options).addTo(map);
    geoJSONLayer && geoJSONLayer.addTo(map);
    controlObject && controlObject.addTo(map);

    return {
      get map() {
        return map;
      },
      get geoJSONLayer() { return geoJSONLayer; },
      set geoJSONLayers(data: IGeoJSON) {
        if (geoJSONLayer && map) {
          geoJSONLayer.addData(data);
          const bounds = geoJSONLayer.getBounds();
          map.fitBounds(bounds);
        }
      },
      resetLayers() {
        geoJSONLayer && geoJSONLayer.clearLayers();
      },
      updatePropertiesInsideInfoControl(properties) {
        controlObject && controlObject.update(properties);
      }
    }
  }

  async builder(config: any, _) {
    this._setMapOptions(config);

    // geoJSON mapping can be overridden by passing in the config
    if (config.geoJSONMapping) {
      this.mappingConfig = config.geoJSONMapping;
    }

    this.getGeoJSON.pipe(
      skipWhile(input => input === undefined || input === null || !(input.hasOwnProperty('state') || input.hasOwnProperty('country'))),
      switchMap(input => {
        const { country, states, state, districts, metrics, labelExpr, strict, folder, reportData = [] } = input;
        let paramter;
        if (country) {
          paramter = { type: 'country', name: country };
        } else {
          paramter = { type: 'state', name: state };
        }
        const { geoJSONFilename = null } = this.findRecordInConfigMapping(paramter) || {};
        if (!geoJSONFilename) {
          return throwError('specified geoJSON file not found');
        }
        return this.getGeoJSONFile({ fileName: geoJSONFilename, folder }).pipe(
          map(geoJSONData => {
            const { type, features = [] } = cloneDeep(geoJSONData) as IGeoJSON;
            let filteredFeatures;
            if (country && states.length) {
              filteredFeatures = this.addProperties({ reportData, layers: states, labelExpr, type: 'state', features, metrics });
            } else {
              filteredFeatures = this.addProperties({ reportData, layers: districts, labelExpr, type: 'district', features, metrics });
            }
            return { type, features: strict ? filteredFeatures : features };
          },
            catchError(err => {
              return of({
                type: 'FeatureCollection',
                features: []
              })
            }))
        );
      }),
      tap((geoJSONLayers: IGeoJSON) => {
        if (this.mapClosure) {
          this.mapClosure.geoJSONLayers = geoJSONLayers;
        }
      })
    ).subscribe()
  }

  reset(): void {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  destroy(): void {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  update(input: Partial<UpdateInputParams>) {
    this.checkIfInitialized();
    if (!input) throw new Error(this.CONSTANTS.INVALID_INPUT);
    if (this.mapClosure) {
      const { data = null, config = {} } = input;
      this._setMapOptions(config);
      if (this.inputParameters && data) {
        this.mapClosure.resetLayers();
        this.getGeoJSON.next({ ...this.inputParameters, strict: true, reportData: data });
      }
    }
  }

  addData(data: object | object[]) {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  refreshChart() {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  getTelemetry() {
    throw new Error(this.CONSTANTS.METHOD_NOT_IMPLEMENTED);
  }

  exportAs(format: string) {
    if (!this.exportOptions.includes(format)) {
      throw new Error('given type not supported');
    }
    this.exportAsCsv();
  }

  /**
   * @description click handler for a specfic layer within the map
   * @private
   * @param {*} { properties, metaData }
   * @param {*} event
   * @memberof Map2Component
   */
  private clickHandler({ properties = {}, metaData = {} }: { properties: Properties; metaData: Partial<ICustomMapObj> }, event) {
    console.log({ ...properties, ...metaData });
    this.events.emit({
      type: 'CLICK',
      event: {
        ...metaData, ...properties
      }
    })
  }

  /**
   * @description handles mouse out event for a specific layer
   * @private
   * @param {*} { properties, metaData }
   * @param {*} event
   * @memberof Map2Component
   */
  private mouseoutHandler({ properties = {}, metaData = {} }: { properties: Properties; metaData: Partial<ICustomMapObj> }, event) {
    if (this.mapClosure) {
      this.mapClosure.geoJSONLayer.resetStyle(event.target);
    }
  }

  /**
   * @description mouseover event handler
   * @private
   * @param {*} { properties, metaData }
   * @param {*} event
   * @memberof Map2Component
   */
  private mouseoverHandler({ properties = {}, metaData = {} }: { properties: Properties; metaData: Partial<ICustomMapObj> }, event) {
    const layer = event.target;
    layer.setStyle({
      weight: 3,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.8
    });
    if (L && (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge)) {
      layer.bringToFront();
    }
    this.mapClosure && this.mapClosure.updatePropertiesInsideInfoControl(properties);
    const mergedObj = { ...properties, ...metaData };
    this.events.emit({
      type: 'HOVER',
      event: {
        ...mergedObj
      }
    });
    layer.bindPopup(mergedObj.name || 'Unknown').openPopup();
  }

  /**
   * @description attaches event handlers on each layer
   * @private
   * @param {*} feature
   * @param {*} layer
   * @memberof Map2Component
   */
  private onEachFeature(feature, layer) {
    const { properties, metaData = {} } = feature;
    layer.on({
      mouseover: this.mouseoverHandler.bind(this, { properties, metaData }),
      mouseout: this.mouseoutHandler.bind(this, { properties, metaData }),
      click: this.clickHandler.bind(this, { properties, metaData })
    });
  }

  private getControlObject() {
    const { controlTitle } = this.inputParameters as any;
    const infoControl = L && L.control();
    infoControl.onAdd = function (map) {
      this._div = L && L.DomUtil.create('div', 'infoControl');
      this.update();
      return this._div;
    };
    infoControl.update = function (properties = {}) {
      const text = Object.entries(properties).map(([key, value]) => `<br />${key}: ${value}`).join('<br />');
      this._div.innerHTML = `<h4>${controlTitle}</h4>
      ${text}`;
    };

    return infoControl;
  }

  /**
   * @description sets styles for each feature layer
   * @private
   * @param {*} feature
   * @returns
   * @memberof MapComponent
   */
  private setStyle(feature, layer) {
    const { metaData = {} } = feature;
    return {
      ...this.inputParameters['rootStyle'], ...(!metaData.drillDown && !metaData.fileName &&
        { className: 'notAllowedCursor' })
    };
  }

  /**
 * @description dynamically add custom properties from external JSON to feature Objects
 * @private
 * @param {*} { reportData = [], layers = [], labelExpr = 'District', type = 'district', features = [], metrics = [] }
 * @returns
 * @memberof MapComponent
 */
  private addProperties({ reportData = [], layers = [], labelExpr = 'District', type = 'district', features = [], metrics = [] }) {
    const filteredFeatures = [];
    const datasets = groupBy(reportData || [], data => toLower(data[labelExpr]));
    layers.forEach(layer => {
      const recordFromConfigMapping = this.findRecordInConfigMapping({ type, name: layer });
      const dataset = datasets.hasOwnProperty(toLower(layer)) && datasets[toLower(layer)];
      const featureObj = features.find(feature => {
        const { properties = {} } = feature;
        return recordFromConfigMapping && +properties.code === +recordFromConfigMapping.code;
      });
      if (!recordFromConfigMapping || !dataset || !featureObj) { return; }
      featureObj['metaData'] = { name: layer };
      const result = reduce(dataset, (accumulator, value) => {
        metrics.forEach(metric => {
          accumulator[metric] = (accumulator[metric] || 0) + (+value[metric]);
        });
        return accumulator;
      }, {});
      featureObj.properties = {
        ...(featureObj.properties || {}),
        ...(result || {})
      };
      filteredFeatures.push(featureObj);
    });
    return filteredFeatures;
  }


  private findRecordInConfigMapping({ type = null, name = null, code = null }) {
    return find(this.mappingConfig, config => {
      const { type: configType, name: configName, code: configCode } = config;
      if (code) { return configCode === code; }
      return configType && configName && toLower(configType) === toLower(type) && toLower(configName) === toLower(name);
    });
  }

  private getGeoJSONFile({ folder = 'geoJSONFiles', fileName }: Record<string, string>): Observable<IGeoJSON> {
    return this.dataService.fetchGeoJSONFile(`${folder}/${fileName}`);
  }
}
