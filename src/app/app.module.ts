import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SupabaseService } from './services/supabase.service';
import { NotificationService } from './services/notification.service';

import { addIcons } from 'ionicons';
import { cashOutline, notificationsOutline, settingsOutline, add } from 'ionicons/icons';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SupabaseService,
    NotificationService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    addIcons({
      'cash-outline': cashOutline,
      'notifications-outline': notificationsOutline,
      'settings-outline': settingsOutline,
      'add': add
    });
  }
}

