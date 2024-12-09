import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class AppComponent {
  constructor(private platform: Platform, private themeService: ThemeService) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    
    // Initialize dark mode
    const isDark = this.themeService.isDarkMode();
    this.themeService.setDarkMode(isDark);
    
    this.themeService.getDarkModeObservable().subscribe(isDark => {
      StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
    });

    // Request geolocation permissions
    await this.requestGeolocationPermission();
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

