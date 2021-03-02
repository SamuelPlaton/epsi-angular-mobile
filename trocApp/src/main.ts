import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import dotenv from 'dotenv';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Enable .env config variables
dotenv.config();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
