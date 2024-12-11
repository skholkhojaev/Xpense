import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    
    this.initializeDarkMode();
    await this.requestGeolocationPermission();
    await StatusBar.setStyle({ style: Style.Light });
  }

  initializeDarkMode() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.setDarkMode(prefersDark.matches);

    prefersDark.addListener((mediaQuery) => this.setDarkMode(mediaQuery.matches));
  }

  setDarkMode(enable: boolean) {
    document.body.classList.toggle('dark', enable);
  }

  async requestGeolocationPermission() {
    try {
      const status = await Geolocation.requestPermissions();
      console.log('Geolocation permission status:', status);
    } catch (error) {
      console.error('Error requesting geolocation permission:', error);
    }
  }
}

