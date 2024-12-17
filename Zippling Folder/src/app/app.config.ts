import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { appRouterProviders } from './app.routes';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { DatePipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    DatePipe,
    CurrencyPipe,
    PercentPipe, provideAnimationsAsync()
  ],
};
