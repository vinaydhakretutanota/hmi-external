# HmiExternal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.13.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## How to run in development:
Note: Due to this issue npm7 doesnt resolve dependencies for now: https://github.com/npm/cli/issues/2339
Open hmi-external folder
npm install
Go to projects/external-components
npm install
ng build external-components --watch
open terminal inside dist/external-components
npm link
Go to HMI workspace folder and open cmd
npm link external-components
You are now ready to use the components from the external-components library.