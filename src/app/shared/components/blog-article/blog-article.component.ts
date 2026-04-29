import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { ThemeService } from '../../../core/services/theme.service';
import { DomSanitizer, SafeHtml, Title, Meta } from '@angular/platform-browser';
import { BlogPost } from '../../../core/data/blog-post';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-article',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div [ngClass]="theme.isDarkTheme() ? 'dark' : ''" class="min-h-screen bg-bg-primary">
      
    <header class="fixed top-0 w-full z-[100] backdrop-blur-md border-b border-border-default bg-bg-secondary/80 h-20 flex items-center px-8 justify-between">
      <div class="flex items-center space-x-2 cursor-pointer" routerLink="/">
        <img src="/assets/Sagescript-logo.png" alt="SageScript Logo" class="h-10">
      </div>
      
      <nav class="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest text-gray-500">
        <a routerLink="/" fragment="features" class="hover:text-highlight transition-colors">Features</a>
         <a routerLink="/" fragment="capabilities" class="hover:text-highlight transition-colors cursor-pointer">Capabilities</a>
        <a routerLink="/" fragment="resources" class="text-highlight transition-colors">Resources</a>
        <a routerLink="/" fragment="team" class="hover:text-highlight transition-colors">Team</a>
         <a routerLink="/" fragment="faq" class="hover:text-highlight transition-colors cursor-pointer">FAQ</a>
      </nav>

      <div class="flex items-center space-x-6">
        <button (click)="theme.toggleTheme()" class="p-2 rounded-full hover:bg-highlight/10 text-gray-500 transition-colors">
            <svg *ngIf="theme.isDarkTheme()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke-width="2"/></svg>
            <svg *ngIf="!theme.isDarkTheme()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke-width="2"/></svg>
        </button>
        <button routerLink="/app" class="bg-highlight hover:bg-purple-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-highlight/20">Get Started</button>
      </div>
    </header>
    
   <!-- ARTICLE LAYOUT -->
    <main class="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div *ngIf="post; else notFound">
        
        <!-- Breadcrumbs for SEO -->
        <nav class="mb-8 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <a routerLink="/" class="hover:text-highlight">Home</a>
          <span>/</span>
          <a routerLink="/" fragment="resources" class="hover:text-highlight">Resources</a>
          <span>/</span>
          <span class="text-highlight">{{ post.category }}</span>
        </nav>

        <article class="animate-fade-up">
          <h1 class="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-8">
            {{ post.title }}
          </h1>
          
          <div class="flex items-center space-x-4 mb-12 pb-8 border-b border-border-default">
            <div class="w-10 h-10 rounded-full bg-highlight/20 flex items-center justify-center text-highlight font-bold">SS</div>
            <div class="flex flex-col">
              <span class="text-sm font-black uppercase">SageScript Editorial</span>
              <span class="text-[10px] text-gray-500 font-bold tracking-widest">{{ post.readTime }} • Updated April 2026</span>
            </div>
          </div>

          <!-- Dynamic Content Injection -->
          <div class="blog-content space-y-6 text-lg text-gray-400 leading-relaxed font-medium" [innerHTML]="safeContent"></div>
        </article>
      </div>

      <ng-template #notFound>
        <div class="py-40 text-center space-y-6">
          <h2 class="text-3xl font-black">Article Lost in the Agentic Cloud</h2>
          <p class="text-gray-500">We couldn't find the resource you were looking for.</p>
          <button routerLink="/" class="px-8 py-3 bg-highlight text-white rounded-xl font-bold">Return to Earth</button>
        </div>
      </ng-template>
    </main>

    <!-- ARTICLE FOOTER -->
    <footer class="mt-20 py-10 border-t border-border-default bg-bg-secondary/30 text-center">
       <img src="/assets/Sagescript-logo.png" alt="Logo" class="h-6 mx-auto mb-4 opacity-50">
       <p class="text-[10px] font-black text-gray-500 uppercase tracking-widest">© 2026 SageScript AI • The Future of Agentic Testing</p>
    </footer>
  </div>
  `
})
export class BlogArticleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  theme = inject(ThemeService);
  private sanitizer = inject(DomSanitizer);
  private title = inject(Title);
  private meta = inject(Meta);
  
  post?: BlogPost;
  safeContent?: SafeHtml;

  ngOnInit() {
    // 1. Get the slug from the URL: /resources/agentic-ai-...
    const slug = this.route.snapshot.paramMap.get('slug');
    
    if (slug) {
      this.post = this.blogService.getPostBySlug(slug);
      if (this.post) {
        // 2. Bypass security for our own trusted HTML content
        this.safeContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);
        this.updateMetaTags(this.post);
      }
    }
  }

  updateMetaTags(post: BlogPost) {
    this.title.setTitle(post.metaTitle);
    this.meta.updateTag({ name: 'description', content: post.description });
  }
}