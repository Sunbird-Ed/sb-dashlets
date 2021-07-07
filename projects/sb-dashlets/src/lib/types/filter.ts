export interface IFilterConfig {
    reference: string;
    label: string;
    placeholder: string;
    displayName? : string;
    controlType: "single-select" | "multi-select" | "date";
    searchable?: boolean;
    default?: string;
}