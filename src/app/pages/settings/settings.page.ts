import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  darkMode: boolean;

  constructor(private themeService: ThemeService, private changeDetectorRef: ChangeDetectorRef) {
    this.darkMode = this.themeService.isDarkMode();
  }

  ngOnInit() {
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.themeService.setDarkMode(this.darkMode);
    this.changeDetectorRef.detectChanges();
  }
}

