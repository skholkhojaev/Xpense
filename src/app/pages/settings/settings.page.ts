import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  darkMode: boolean = false;
  private darkModeSubscription?: Subscription;

  constructor(private themeService: ThemeService) {
    this.darkMode = this.themeService.isDarkMode();
  }

  ngOnInit() {
    this.darkModeSubscription = this.themeService.getDarkModeObservable().subscribe(
      isDark => {
        this.darkMode = isDark;
      }
    );
  }

  ngOnDestroy() {
    if (this.darkModeSubscription) {
      this.darkModeSubscription.unsubscribe();
    }
  }

  toggleDarkMode() {
    this.themeService.setDarkMode(!this.darkMode);
  }
}

