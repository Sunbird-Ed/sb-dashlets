export const __defaultConfig = {
    initialCoordinate: [20, 78],
    latBounds: [6.4626999, 68.1097],
    lonBounds: [35.513327, 97.39535869999999],
    initialZoomLevel: 5,
    controlTitle: 'India Heat Map',
    tileLayer: {
        urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
            attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    },
    rootStyle: {
        fillColor: '#007cbe',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        cursor: 'no-drop'
    },
    country: null,
    states: [],
    state: null,
    districts: [],
    metrics: [],
    strict: false,
    folder: 'geoJSONFiles',
    labelExpr: 'District'
};