import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Geolocation } from '@capacitor/geolocation';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private themeService: ThemeService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.setupStatusBar();
      this.setupGeolocation();
    });
  }

  private setupStatusBar() {
    if (this.platform.is('capacitor')) {
      StatusBar.setStyle({ style: Style.Light });
    }
  }

  private async setupGeolocation() {
    try {
      const status = await Geolocation.requestPermissions();
      console.log('Geolocation permission status:', status);
    } catch (error) {
      console.error('Error requesting geolocation permission:', error);
    }
  }
}

