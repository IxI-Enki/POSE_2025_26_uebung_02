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
