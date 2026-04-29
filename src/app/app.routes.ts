// app.routes.ts
import { Routes } from '@angular/router';
import { LandingPageComponent } from './shared/components/landing-page/landing-page.component';
import { TestAutomationShellComponent } from './shared/components/test-automation-shell/test-automation-shell.component'
import { BlogArticleComponent } from './shared/components/blog-article/blog-article.component';
export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Root URL
  { path: 'features', component: LandingPageComponent }, // Points to landing but we'll scroll to section
  { path: 'about', component: LandingPageComponent },
  { path: 'app', component: TestAutomationShellComponent }, // The main tool
  { path: 'resources/:slug', component: BlogArticleComponent },
  { path: '**', redirectTo: '' }
];
