import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SupabaseService } from './services/supabase.service';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AppComponent
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SupabaseService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: () => createClient(environment.supabaseUrl, environment.supabaseKey)
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

