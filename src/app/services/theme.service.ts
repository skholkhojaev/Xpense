import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);

  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.setDarkMode(prefersDark.matches);
    prefersDark.addListener((mediaQuery) => this.setDarkMode(mediaQuery.matches));
  }

  setDarkMode(isDark: boolean) {
    document.body.classList.toggle('dark', isDark);
    this.darkMode.next(isDark);
    localStorage.setItem('darkMode', isDark.toString());
  }

  isDarkMode(): boolean {
    const storedPreference = localStorage.getItem('darkMode');
    return storedPreference ? storedPreference === 'true' : this.darkMode.value;
  }

  getDarkModeObservable() {
    return this.darkMode.asObservable();
  }
}

