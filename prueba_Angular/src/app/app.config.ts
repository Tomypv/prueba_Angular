import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptorFn } from './core/interceptors/http-error.interceptor';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { APP_ROUTES } from './app.routes';

import { MatButtonModule } from '@angular/material/button';

// Creamos el loader para las traducciones
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([httpErrorInterceptorFn])
    ),
    importProvidersFrom(
      MatButtonModule,

      // Importamos el modulo de traducciones con el loader creado
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'es',
        useDefaultLang: true
      })
    )
  ]
};
