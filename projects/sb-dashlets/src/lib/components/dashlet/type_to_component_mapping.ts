import { ChartType, TableType } from '../../types/index';

export const TYPE_TO_COMPONENT_MAPPING = {
  [ChartType.LINE]: { path: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent) },
  [ChartType.BAR]: { path: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent) },
  [ChartType.PIE]: { path: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent) },
  [ChartType.AREA]: { path: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent) },
  [ChartType.BUBBLE]: { path: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent) },
  [ChartType.DOUGHNUT]: { path: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent) },
  [ChartType.POLAR]: { path: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent) },
  [ChartType.SCATTER]: { path: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent) },
  [ChartType.DOUGHNUT]: { path: import('../chart-js/chart-js.component').then(module => module.ChartJsComponent) },
  [ChartType.BIG_NUMBER]: { path: import('../big-number/big-number.component').then(module => module.BigNumberComponent) },
  [TableType.TABLE]: { path: import('../dt-table/dt-table.component').then(module => module.DtTableComponent) },
  [ChartType.MAP]: { path: import('../map/map.component').then(module => module.MapComponent) }
};