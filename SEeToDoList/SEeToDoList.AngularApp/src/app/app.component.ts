import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public title = 'SEMusicStoreAngular-Developer';
  public currentLanguage = 'de';
  public isMenuCollapsed = true;
  public theme: 'light' | 'dark' = 'light';

  public get isLoginRequired(): boolean {
    return this.authService.isLoginRequired;
  }
  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  public get userName(): string {
    return this.authService.user?.name || '';
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private translateService: TranslateService) {
    
    // Initiale Sprache setzen nach kurzer Verzögerung
    setTimeout(() => {
      this.currentLanguage = this.translateService.currentLang || 'de';
    }, 50);
    
    // Auf Sprachwechsel reagieren
    this.translateService.onLangChange.subscribe((event) => {
      this.currentLanguage = event.lang;
    });

    // Theme initialisieren (Persistenz + Systempräferenz)
    const storedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      this.setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  private applyThemeAttribute(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }

  public setTheme(theme: 'light' | 'dark') {
    this.theme = theme;
    this.applyThemeAttribute(theme);
    localStorage.setItem('app-theme', theme);
  }

  public toggleTheme() {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  public switchLanguage(language: string) {
    console.log('Switching to language:', language); // Debug
    this.translateService.use(language).subscribe(() => {
      this.currentLanguage = language;
      console.log('Language switched to:', this.currentLanguage); // Debug
    });
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }
}
