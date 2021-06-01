export const FILTER_DEFAULT_CONFIG = {
    config: {
        controlType: 'multi-select',
        searchable: true,
        default: [],
        placeholder: 'Select Option',
        options: [],
        dateFormat: 'DD-MM-YYYY'
    },
    dropdownSettings: {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
    }
}