import { Routes } from '@angular/router';
import { DonationsComponent } from './donations/donations.component';
import { PrivateComponent } from './private/private.component';
import { DocsvoluntersComponent } from './private/docsvolunters/docsvolunters.component';
import { PublicComponent } from './public/public.component';

import { ExcelreportsComponent } from './private/excelreports/excelreports.component';
import { LoginComponent } from './public/login/login.component';
import { IntranetComponent } from './public/intranet/intranet.component';
import { HomeComponent } from './public/home/home.component';
import { authGuard } from './shared/guards/auth.guard';
import { PerfilesPuestosComponent } from './public/perfiles-puestos/perfiles-puestos.component';
import { OrganigramaComponent } from './public/organigrama/organigrama.component';
import { FormatosComponent } from './public/formatos/formatos.component';


export const routes: Routes = [
   {
      path: 'public',
      component: PublicComponent,
      children: [
         {
            path: 'login',
            component: LoginComponent
         },
         {
            path: 'intranet',
            component: IntranetComponent
         },
         {
            path: 'home',
            component: HomeComponent
         },
         {
            path: 'perfiles',
            component: PerfilesPuestosComponent
         },
         {
            path: 'organigrama',
            component: OrganigramaComponent
         },
         {
            path: 'formatos',
            component: FormatosComponent
         },
      ]
   },
   {
      path: 'private',
      component: PrivateComponent,
      canActivate: [authGuard],
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
      path: '',
      redirectTo: 'public/home',
      pathMatch: 'full'
   },
   {
      path: '**',
      redirectTo: 'public/home',
      //pathMatch: 'prefix'
   }

];
