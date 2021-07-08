import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { data } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'dashlet-showcase';

  type = "line";

  config = {
    labelExpr: 'District',
    datasets: [
      { dataExpr: 'Total Plays', label: 'Total Plays' }
    ]
  };

  config2 = {
    labelExpr: 'District',
    datasets: [
      { dataExpr: 'Total Plays', label: 'Total Plays' },
      { dataExpr: 'Total Devices', label: 'Total Devices' },
      { dataExpr: 'New Devices', label: 'New Devices' }
    ],
    options: {
      title: {
        text: `Device Metrics`,
        display: true,
        fontSize: 20
      }
    }
  };

  data2 = {
    values: data
  };

  data = {
    location: {
      url: '/assets/data.json',
      method: 'GET'
    }
  }

  dtOptions = {
    data: data,
    info: false,
    columns: [{
      title: 'Districts',
      data: 'District'
    },
    {
      title: 'Total Devices',
      data: 'Total Devices'
    }, {
      title: 'New Devices',
      data: 'New Devices'
    }, {
      title: 'Goal of Devices',
      data: 'Goal of Devices'
    },
    {
      title: 'Content Plays Goal',
      data: 'Goal of content plays'
    }]
  };


  bigNumberConfig = {
    header: 'Total Device Count (SUM)',
    footer: 'Uttar Pradesh',
    dataExpr: 'Total Devices'
  }

  bigNumberConfig2 = {
    header: 'Total New Devices Count (MAX)',
    footer: 'Uttar Pradesh',
    dataExpr: 'New Devices',
    operation: 'MAX'
  }
  bigNumberConfig3 = {
    header: 'Total New Devices Count (MIN)',
    footer: 'Uttar Pradesh',
    dataExpr: 'New Devices',
    operation: 'MIN'
  }

  bigNumberConfig4 = {
    header: 'Total New Devices Count (AVG)',
    footer: 'Uttar Pradesh',
    dataExpr: 'New Devices',
    operation: 'AVG'
  }

  columnsConfiguration = {
    filters: [
      {
        "reference": "type",
        "controlType": "multi-select",
        "displayName": "Select Type",
        "placeholder": "Select Type",
        "label": "Select Portal/App",
        "searchable": true
      },
      {
        "reference": "District",
        "controlType": "multi-select",
        "displayName": "Select District",
        "placeholder": "Select District Name",
        "label": "District",
        "searchable": true
      },
      {
        "reference": "Total Plays",
        "controlType": "multi-select",
        "placeholder": "Select Total Count",
        "label": "Total Plays",
        "searchable": true
      },
      {
        "reference": "dateFormat",
        "controlType": "date",
        "placeholder": "Select Date Range",
        "label": "Select Date Range",
        "dateFormat": "DD-MM-YYYY"
      }
    ],
    order: [1, 'desc'],
    searchable: true,
    bFilter: true,
    columnConfig: [
      { title: "District", data: "District" },
      { title: "Total Devices", data: "Total Devices" },
      { title: 'Total Plays Portal', data: 'Total Plays' },
      { title: 'Total Plays App', data: 'Total Plays' },
      { title: 'Total Count', data: 'Total Plays' },
      { title: 'Date', data: 'dateFormat' },
      {
        title: 'Actions', data: 'District',
        render(data) {
          return `<div class="btn-group" role="group" aria-label="Basic mixed styles example">
      <button type="button" class="btn btn-danger">Action 1</button>
      <button type="button" class="btn btn-warning">Action 2</button>
    </div>` }
      }
    ]
  }

  mapData = {
    filters: [
      {
        "reference": "District",
        "controlType": "multi-select",
        "displayName": "Select District",
        "placeholder": "Select District Name",
        "label": "District",
        "searchable": true
      }
    ],
    "state": "Uttar Pradesh",
    "folder": "assets",
    "metrics": [
      "Total Plays",
      "Old Devices"
    ],
    "districts": [
      "Lucknow",
      "Allahabad",
      "Aligarh",
      "Azamgarh",
      "Jaunpur",
      "Bijnor",
      "Kanpur Nagar",
      "Ghaziabad",
      "Ghazipur",
      "Lakhimpur",
      "Agra",
      "Farrukhabad",
      "Bulandshehr",
      "Mathura",
      "Varanasi",
      "Ballia",
      "Fatehpur",
      "Unnao",
      "Gautam Buddh Nagar",
      "Ambedkar Nagar",
      "Saharanpur",
      "Bareilly"
    ],
    "labelExpr": "District",
    "controlTitle": "Tamil Nadu Weekly Usage",
    "omitMetrics": ["st_code", "code"]
  }

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.renderer.listen('document', 'click', (event) => {
      if (event.target.hasAttribute("data")) {
        // do something with the data
      }
    });
  }
}
