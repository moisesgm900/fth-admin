import { ApplicationConfig } from '@angular/core';
import { provideRouter,withHashLocation} from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';


export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(),
               provideRouter(routes, withHashLocation()), provideAnimationsAsync()]

};
