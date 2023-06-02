# sb-dashlets

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.3.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Versions

| release branch    | npm package version | Angular Version |
|-------------------|---------------------|-----------------|
| V10_Migration     |      5.1.0          |     Ng V10      |
| V11_Migration     |      5.1.1          |     Ng V11      |
| V12_Migration     |      5.1.2          |     Ng V12      |
| V13_Migration     |      5.1.3          |     Ng V13      |
| V14_Migration     |      6.0.4          |     Ng V14      |

## Note 
While running command -> ng build sb-dashlates if you are facing below Error

✖ Bundling to FESM2015
ERROR: Invalid value for option "output.file" - when building multiple chunks, the "output.dir" option must be used, not "output.file". To inline dynamic imports, set the "inlineDynamicImports" option.

FIX: Use this path ->  node_modules/ng-packagr/lib/flatten/rollup.js change the  inlineDynamicImports: false ->   inlineDynamicImports: true,
