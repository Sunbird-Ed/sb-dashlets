export interface IGeoJSON {
    type: string;
    features: Feature[];
}

export interface Feature {
    type: FeatureType;
    geometry: Geometry;
    properties: Properties;
}

export interface Geometry {
    type: GeometryType;
    coordinates: Array<Array<number[]>>;
}

export enum GeometryType {
    Polygon = 'Polygon',
}

export enum FeatureType {
    Feature = 'Feature',
}

export interface Properties {
    [key: string]: any;
}

export interface ICustomMapObj {
    drillDown: boolean;
    name: string;
    fitBounds: boolean;
    district?: string;
    st_nm?: string;
    dt_code?: string | number;
    st_code?: string | number;
}

export interface IInputMapData {
    state: string;
    districts?: string[];
    metrics?: string[];
    folder?: string;
    labelExpr?: string;
    reportLoc?: string;
    reportData?: string;
    strict?: boolean;
    country?: string;
    states?: string[];
}

export interface RequestParam {
    /**
     * http data
    */
  url: string;
    /**
     * http params
    */
  param?: any;
    /**
     * http header
    */
  header?: {[key: string]: string | string[]};
    /**
     * http data
    */
  data?: any;
}

export interface ServerResponse {
    /**
     * api id
    */
    id: string;
    /**
     * response param
    */
    params: Params;
    /**
     * response code
    */
    responseCode: string;
    /**
     * server result
    */
    result: any;
    /**
     * time stamp
    */
    ts: string;
    /**
     * api version
    */
    ver: string;

    headers?: any;
}

export interface Params {
    resmsgid: string;
    msgid?: any;
    err?: any;
    status: string;
    errmsg?: any;
}

export interface IBigNumberChart {
    header: 'string';
    dataExpr: 'string';
    footer?: 'string';
}
