# Sunbird

## @project-sunbird/sb-dashlet

<p>
  <img alt="angular" src="https://img.shields.io/badge/-Angular-DD0031?style=flat-square&logo=angular&logoColor=white" height=25 />
  <img alt="TypeScript" src="https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" height=25 />
</p>

The library contains the Reusable charts. Supported by charts has an extensible, general-purpose analytical presentation capabilities like graphs, tables, charts

---
## Getting started
How to use @project-sunbird/sb-dashlet in your projects

## Using library locally

1. Build library
```console
npm run build-lib
```
## Note 
    While running command -> ng build sb-dashlates if you are facing below Error
    
    ✖ Bundling to FESM2015
    ERROR: Invalid value for option "output.file" - when building multiple chunks, the "output.dir" option must be used, not "output.file". To inline dynamic imports, set the       "inlineDynamicImports" option.
    
    FIX: Use this path ->  node_modules/ng-packagr/lib/flatten/rollup.js change the  inlineDynamicImports: false ->   inlineDynamicImports: true,

2. Link library to your project
```console
npm link @project-sunbird/sb-dashlet
```
---

### Step 1: Install the package

    npm install @project-sunbird/sb-dashlet --save

### Step 2: Import the modules and components

  Import the NgModule for each component you want to use:
    
    import { DashletModule } from '@project-sunbird/sb-dashlet';
       
    @NgModule({
        ...
        
        imports: [DashletModule], 
        
        ...
    })
  
    export class TestAppModule { }
    
## Step 3: Include the library selector in view( Eg .HTML file)

**Selector**: sb-dashlet  **Exported as**: DashletModule 
   
     <sb-dashlet [config]='config'></sb-dashlet>

## Versions

| release branch    | npm package version | Angular Version |
|-------------------|---------------------|-----------------|
| V10_Migration     |      5.1.0          |     Ng V10      |
| V11_Migration     |      5.1.1          |     Ng V11      |
| V12_Migration     |      5.1.2          |     Ng V12      |
| V13_Migration     |      5.1.3          |     Ng V13      |
| V14_Migration     |      6.0.5          |     Ng V14      |
| 8.0.0_v15         |      8.0.0          |     Ng V15      |
| 8.0.0_v16         |      8.0.1          |     Ng V16      |


