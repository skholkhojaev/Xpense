import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() { }

  setDarkMode(isDark: boolean) {
    document.body.classList.toggle('dark', isDark);
  }

  isDarkMode(): boolean {
    return document.body.classList.contains('dark');
  }
}

