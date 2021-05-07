import { Component } from '@angular/core';
import { data } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dashlet-showcase';

  type = "line";

  config = {
    labelExpr: 'District',
    datasets: [
      { dataExpr: 'Total Plays', label: 'Total Plays' }
    ],
    options: {
      title: {
        text: `Device Metrics`,
        display: true,
        fontSize: 20
      }
    },
    legend: false
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

  data = {
    values: data
  };

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
    header: 'Total Device Count',
    footer: 'Uttar Pradesh',
    dataExpr: 'Total Devices'
  }

  bigNumberConfig2 = {
    header: 'Total New Devices Count',
    footer: 'Uttar Pradesh',
    dataExpr: 'New Devices',
    operation: 'MIN'
  }

  columnsConfiguration = {
    autoWidth: true,
    paging: true,
    info: true,
    dom: 'Bfrtip',
    buttons: [
      'copy', 'csv', 'excel', 'pdf', 'print'
    ],
    columnConfig: [
      { title: "District", data: "District", searchable: true, orderable: true, autoWidth: true, visible: true },
      { title: "Total Devices", data: "Total Devices", searchable: true, orderable: true, autoWidth: true, visible: true },
    ]
  }
  constructor() { }
}
