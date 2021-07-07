import { ChartType, TableType } from '../../types/index';

export const TYPE_TO_COMPONENT_MAPPING = {
  [ChartType.LINE]: {
    componentPath: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent),
    schemaPath: import("../chart-js/schema").then(module => module.schema)
  },
  [ChartType.BAR]: {
    componentPath: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent),
    schemaPath: import("../chart-js/schema").then(module => module.schema)
  },
  [ChartType.PIE]: {
    componentPath: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent),
    schemaPath: import("../chart-js/schema").then(module => module.schema)
  },
  [ChartType.AREA]: {
    componentPath: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent),
    schemaPath: import("../chart-js/schema").then(module => module.schema)
  },
  [ChartType.BUBBLE]: {
    componentPath: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent),
    schemaPath: import("../chart-js/schema").then(module => module.schema)
  },
  [ChartType.DOUGHNUT]: {
    componentPath: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent),
    schemaPath: import("../chart-js/schema").then(module => module.schema)
  },
  [ChartType.POLAR]: {
    componentPath: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent),
    schemaPath: import("../chart-js/schema").then(module => module.schema)
  },
  [ChartType.SCATTER]: {
    componentPath: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent),
    schemaPath: import("../chart-js/schema").then(module => module.schema)
  },
  [ChartType.DOUGHNUT]: {
    componentPath: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent),
    schemaPath: import("../chart-js/schema").then(module => module.schema)
  },
  [ChartType.BIG_NUMBER]: {
    componentPath: import('../big-number/big-number.component').then(module => module.BigNumberComponent),
    schemaPath: import("../big-number/schema").then(module => module.schema)
  },
  [TableType.TABLE]: {
    componentPath: import('../dt-table/dt-table.component').then(module => module.DtTableComponent),
    schemaPath: import("../dt-table/schema").then(module => module.schema)
  },
  [ChartType.MAP]: {
    componentPath: import('../map/map.component').then(module => module.MapComponent),
    schemaPath: import("../map/schema").then(module => module.schema)
  },
  [ChartType.HORIZONTAL_Bar]: {
    componentPath: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent),
    schemaPath: import("../chart-js/schema").then(module => module.schema)
  },
};