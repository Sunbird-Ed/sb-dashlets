import { InjectionToken } from "@angular/core";

export const DASHLET_CONSTANTS = new InjectionToken('CONSTANTS', {
  factory() {
    return constants;
  }
})

export const constants = {
  INVALID_INPUT: "invalid input",
  METHOD_NOT_IMPLEMENTED: "Method not implemented",
  CHART_NOT_INITIALIZED: "Chart is not initialized"
}
