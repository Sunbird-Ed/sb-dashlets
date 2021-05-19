export interface IFilterConfig {
    reference: string;
    label: string;
    placeholder: string;
    controlType: "single-select" | "multi-select" | "date";
    searchable?: boolean;
    default?: string;
}