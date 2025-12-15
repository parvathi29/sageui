import { Injectable, signal, effect, Renderer2, RendererFactory2 } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'user-theme';
  private renderer: Renderer2;

  // Signal to hold the current theme state
  currentTheme = signal<Theme>('light'); 

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeTheme();

    // Effect to apply the 'dark' class whenever the signal changes
    effect(() => {
      if (this.currentTheme() === 'dark') {
        this.renderer.addClass(document.body, 'dark');
      } else {
        this.renderer.removeClass(document.body, 'dark');
      }
    sessionStorage.setItem(this.STORAGE_KEY, this.currentTheme());
    });
  }

  private initializeTheme(): void {
    const savedTheme = sessionStorage.getItem(this.STORAGE_KEY) as Theme;
    
    // Default to light if no preference is saved
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.currentTheme.set(savedTheme);
    } else {
      this.currentTheme.set('light');
    }
  }

  /**
   * Toggles the theme between 'light' and 'dark'.
   */
  toggleTheme(): void {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(newTheme);
  }

  /**
   * Checks if the current theme is dark.
   */
  isDarkTheme(): boolean {
    return this.currentTheme() === 'dark';
  }
}