import { Routes } from '@angular/router';
import { DonationsComponent } from './donations/donations.component';
import { PrivateComponent } from './private/private.component';
import { DocsvoluntersComponent } from './private/docsvolunters/docsvolunters.component';
import { PublicComponent } from './public/public.component';

import { ExcelreportsComponent } from './private/excelreports/excelreports.component';


export const routes: Routes = [
   /*  {path: 'donations', component: DonationsComponent },
    {path: 'docvolunters', component: DocsvoluntersComponent }, */
    {
        path: 'private',
        component: PrivateComponent,
        //canActivate: [authGuard],
        children: [
           {
              path: 'docvolunters',
              component: DocsvoluntersComponent
           },
          {
               path: 'excelreports',
               component: ExcelreportsComponent
          }
         
        ]
     },
     {
        path: '' , component: PublicComponent
     }, 
     {
      path: '',
      redirectTo: 'private',
      pathMatch: 'prefix'
   }

];
