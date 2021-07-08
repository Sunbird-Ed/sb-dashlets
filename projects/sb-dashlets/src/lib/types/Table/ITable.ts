import { IBase } from "../IBase";

interface ITableBase extends IBase {
    config: object
    readonly _defaultConfig: object
    tableBuilder(config, data);
}

export interface ITable extends ITableBase {
    addData(data: object | object[]);
}