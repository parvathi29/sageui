import { Component, Output, EventEmitter, inject,AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { BLOG_POSTS } from '../../../core/data/blog-post';
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- <div [ngClass]="theme.isDarkTheme() ? 'dark' : ''" class="min-h-screen font-inter selection:bg-highlight/30"> -->
         <div [ngClass]="theme.isDarkTheme() ? 'dark' : ''"  class="min-h-screen font-inter selection:bg-highlight/30 ">
<header class="fixed top-0 w-full z-[100] backdrop-blur-md border-b border-border-default bg-bg-secondary/80 h-20 flex items-center px-8 justify-between">
  <div class="flex items-center space-x-2 cursor-pointer" routerLink="/">
    <img src="/assets/Sagescript-logo.png" alt="SageScript Logo" class="h-10">
  </div>

  <nav class="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest text-gray-500">
    <a routerLink="/" fragment="features" class="hover:text-highlight transition-colors cursor-pointer">Features</a>
    <a routerLink="/" fragment="capabilities" class="hover:text-highlight transition-colors cursor-pointer">Capabilities</a>
     <a routerLink="/" fragment="resources" class="hover:text-highlight transition-colors">Resources</a>
    <a routerLink="/" fragment="team" class="hover:text-highlight transition-colors cursor-pointer">Team</a>
   
    <a routerLink="/" fragment="faq" class="hover:text-highlight transition-colors cursor-pointer">FAQ</a>
  </nav>

  <div class="flex items-center space-x-6">
    <button (click)="theme.toggleTheme()" class="p-2 rounded-full hover:bg-highlight/10 text-gray-500 transition-colors">
            <svg *ngIf="theme.isDarkTheme()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke-width="2"/></svg>
            <svg *ngIf="!theme.isDarkTheme()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke-width="2"/></svg>
        </button>
    <button routerLink="/app" class="bg-highlight hover:bg-purple-700 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-highlight/20">
      Get Started
    </button>
  </div>
</header>

      <main class="bg-bg-primary text-text-default">
        
        <section class="relative pt-20 pb-32 overflow-hidden flex flex-col items-center text-center px-2">
          <div class="absolute inset-0 z-0">
            <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-highlight/20 blur-[120px] rounded-full animate-pulse"></div>
            <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
          </div>

          <div class="relative z-10 max-w-4xl space-y-8 animate-fade-up">
            <div class="inline-flex items-center px-4 py-2 rounded-full bg-highlight/10 border border-highlight/20 text-highlight text-sm font-bold tracking-wide mb-4">
              <span class="mr-2">✨</span> Powered by Agentic AI
            </div>
            <h1 class="text-6xl md:text-8xl font-black tracking-tighter leading-tight">
              Sage <span class="text-highlight">Script</span>
            </h1>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-500 max-w-2xl mx-auto leading-snug">
              Simplify Testing. <span class="text-text-default">Amplify Quality.</span>
            </h2>
            <p class="text-lg text-gray-500 max-w-xl mx-auto">
              Your AI-powered QA assistant. Transform user stories into comprehensive test cases and automation scripts — instantly.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <button routerLink="/app" class="w-full sm:w-auto px-10 py-4 bg-highlight text-white rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform">Get Started</button>
              <button [routerLink]="['/app']" [queryParams]="{ view: 'onboarding' }" class="w-full sm:w-auto px-10 py-4 border border-border-default rounded-2xl font-black hover:bg-bg-secondary transition-all">Try Demo</button>
            </div>
          </div>
        </section>

         <section id="walkthrough" class="reveal relative bg-bg-secondary/60 border-y border-border-default py-32 px-6 flex flex-col items-center text-center overflow-hidden">
          
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-highlight/5 blur-[160px] rounded-full z-0"></div>

          <div class="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
            
            <div class="mb-20 space-y-4">
              <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-highlight/10 border border-highlight/20 text-highlight text-xs font-black uppercase tracking-widest">
                <span class="mr-2">▶</span> Tool Walkthrough
              </span>
              <h2 class="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
                See <span class="text-highlight">SageScript</span> in Action
              </h2>
              <p class="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Watch how seamlessly you can transform requirements into production-ready test assets.
              </p>
            </div>

            <div class="relative w-full max-w-6xl aspect-video group">
              
              <div class="absolute-inset 4 bg-highlight/30 blur-2xl rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 "></div>

              <div class="relative z-10 h-full w-full bg-bg-secondary border border-border-default p-4 rounded-[40px] shadow-2xl overflow-hidden active:scale-[0.99] transition-transform">
                
                <div class="h-full w-full bg-bg-primary rounded-[30px] border border-border-default overflow-hidden flex items-center justify-center relative">
                   <!-- <video #walkthroughVideo 
                          class="w-full h-full object-cover"
                          controls
                          poster="/assets/video-poster.png">
                     <source src="/assets/tool-video.mp4" type="video/mp4">
                     Your browser does not support the video tag.
                   </video> -->
                   <iframe src="https://app.supademo.com/embed/cmoq6f7p62k8kw9doord29tjr?embed_v=2&utm_source=embed"

  
  class="w-full h-full border-none"
  allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
  allowfullscreen>
</iframe>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section id="capabilities" class="reveal max-w-7xl mx-auto px-6 py-24">
          <div class="text-center mb-16">
             <span class="text-highlight font-black uppercase text-[10px] tracking-[0.3em]">Capabilities</span>
             <h2 class="text-4xl md:text-5xl font-black mt-2">Everything You Need to <span class="text-highlight">Ship Quality</span></h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div *ngFor="let item of capabilities" class="card-reveal p-8 bg-bg-secondary/40 backdrop-blur-xl border border-border-default rounded-[40px] hover:border-highlight/50 transition-all group hover:shadow-2xl">
              <div class="w-14 h-14 bg-highlight/10 rounded-2xl flex items-center justify-center text-highlight mb-6 group-hover:scale-110 transition-transform">
                 <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" [innerHTML]="item.icon"></svg>
              </div>
              <h3 class="text-2xl font-black mb-3">{{item.title}}</h3>
              <p class="text-gray-500 leading-relaxed">{{item.desc}}</p>
            </div>
          </div>
        </section>

         <section id="features" class="py-24 space-y-32 overflow-hidden">
          <div *ngFor="let feat of features; let i = index" class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div [ngClass]="{'md:order-2': i % 2 !== 0}" class="relative group bg-bg-secondary p-4 rounded-[40px] border border-border-default aspect-video flex items-center justify-center overflow-hidden">
          <!-- <div [ngClass]="{'md:order-2': i % 2 !== 0}" class="bg-bg-secondary p-4 rounded-[40px] border border-border-default aspect-video flex items-center justify-center"> -->
              <div class="absolute -inset-4 bg-highlight/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <!-- <div class="relative bg-bg-secondary border border-border-default p-4 rounded-[40px] shadow-2xl overflow-hidden"> -->
                <div class="bg-bg-primary aspect-video rounded-[30px] flex items-center justify-center border border-border-default overflow-hidden">
                   <img [src]="feat.img" class="w-full h-full object-cover">
                </div>
              <!-- </div> -->
            </div>
            <div class="space-y-6">
              <span class="px-4 py-1.5 bg-highlight/10 text-highlight text-[10px] font-black uppercase rounded-lg tracking-widest">{{feat.tag}}</span>
              <h2 class="text-4xl font-black">{{feat.title}}</h2>
              <p class="text-lg text-gray-500">{{feat.desc}}</p>
              <div class="flex items-center space-x-2 text-highlight font-bold">
                 <!-- <span>Learn more</span> -->
                 <!-- <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="2"/></svg> -->
              </div>
            </div>
</div>
        </section>
<!-- 
        <section class="reveal bg-highlight py-20 my-24 relative overflow-hidden">
          <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white relative z-10">
            <div *ngFor="let stat of stats" class="space-y-2">
               <h2 class="text-6xl font-black">{{stat.val}}</h2>
               <p class="text-white/80 font-bold uppercase tracking-widest text-xs">{{stat.label}}</p>
            </div>
          </div>
        </section> -->

        <section id="benefits" class="reveal max-w-7xl mx-auto px-6 py-24">
           <div class="text-center mb-16">
              <span class="text-highlight font-black uppercase text-[10px] tracking-[0.3em]">Why SageScript</span>
              <h2 class="text-4xl md:text-5xl font-black mt-2">Built for <span class="text-highlight">Speed & Scale</span></h2>
           </div>
           <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div *ngFor="let ben of benefits" class="p-10 bg-bg-secondary border border-border-default rounded-[32px] hover:border-highlight/40 transition-all flex flex-col items-center text-center">
                 <div class="w-12 h-12 bg-bg-primary rounded-xl flex items-center justify-center text-highlight mb-6">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" [innerHTML]="ben.icon"></svg>
                 </div>
                 <h3 class="text-3xl font-black mb-2">{{ben.title}}</h3>
                 <p class="text-gray-500 font-medium">{{ben.sub}}</p>
              </div>
           </div>
        </section>

<section id="resources" class="reveal max-w-7xl mx-auto px-6 py-24 border-t border-border-default">
  <div class="text-center mb-16">
    <span class="text-highlight font-black uppercase text-[10px] tracking-[0.3em]">Insights</span>
    <h2 class="text-5xl font-black mt-4">The Future of <span class="text-highlight">Autonomous QA</span></h2>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <!-- Loop through only the first 3 articles for the landing page preview -->
    <div *ngFor="let post of featuredPosts" 
         class="bg-bg-secondary border border-border-default rounded-[32px] overflow-hidden hover:border-highlight/50 transition-all group cursor-pointer"
         [routerLink]="['/resources', post.slug]">
      
      <div class="p-8 space-y-4">
        <span class="text-highlight text-[10px] font-black uppercase tracking-widest">{{ post.category }}</span>
        <h3 class="text-xl font-black group-hover:text-highlight transition-colors">{{ post.title }}</h3>
        <p class="text-gray-500 text-sm line-clamp-3">{{ post.description }}</p>
        
        <div class="pt-4 flex items-center text-highlight font-bold text-xs uppercase">
          Read Article <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-width="2"/></svg>
        </div>
      </div>
    </div>
  </div>
</section>


        <!-- <section class="reveal max-w-7xl mx-auto px-6 py-32 border-t border-border-default">
  <div class="text-center mb-20">
    <span class="text-highlight font-black uppercase text-[10px] tracking-[0.3em]">Testimonials</span>
    <h2 class="text-5xl font-black mt-4">Trusted by <span class="text-highlight">QA Teams</span></h2>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div *ngFor="let review of testimonials" 
         class="p-10 bg-bg-secondary border border-border-default rounded-[40px] flex flex-col justify-between hover:shadow-xl transition-all group">
      <div>
        <div class="text-highlight mb-6 group-hover:scale-110 transition-transform origin-left">
          <svg width="40" height="30" viewBox="0 0 40 30" fill="currentColor">
            <path d="M0 15.6V0h15.6v15.6L10.4 30H0l5.2-14.4zm24.4 0V0H40v15.6L34.8 30H24.4l5.2-14.4z" opacity="0.2" />
          </svg>
        </div>
        <p class="text-lg italic leading-relaxed text-gray-500 mb-8 group-hover:text-text-default transition-colors">
          "{{review.quote}}"
        </p>
      </div>
      <div class="pt-8 border-t border-border-default flex flex-col">
        <span class="font-black text-text-default text-lg">{{review.author}}</span>
        <span class="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">{{review.role}}</span>
      </div>
    </div>
  </div>
</section> -->

<section id="team" class="reveal bg-bg-secondary/30 py-32">
  <div class="max-w-7xl mx-auto px-6 text-center">
    <span class="text-highlight font-black uppercase text-[10px] tracking-[0.3em]">Our Team</span>
    <h2 class="text-5xl font-black mt-4 mb-20 text-text-default leading-tight">The Minds Behind <span class="text-highlight">SageScript</span></h2>
    
    <div class="flex flex-wrap justify-center gap-12 md:gap-24">
      <div *ngFor="let member of team" class="flex flex-col items-center group">
        <div class="w-24 h-24 rounded-full bg-highlight flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-highlight/30 group-hover:scale-110 transition-all cursor-pointer">
          {{member.initials}}
        </div>
        <div class="mt-6 flex flex-col">
          <span class="font-black text-xl text-text-default">{{member.name}}</span>
          <span class="text-xs text-highlight font-black uppercase tracking-widest mt-1">{{member.title}}</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="cta" class="reveal py-40 px-6 text-center overflow-hidden relative">
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-highlight/10 blur-[150px] rounded-full"></div>
  <div class="relative z-10">
    <h2 class="text-6xl font-black leading-tight mb-8">Ready to Automate <br><span class="text-highlight">Smarter?</span></h2>
    <p class="text-gray-500 text-xl max-w-xl mx-auto mb-12">Join hundreds of QA teams already shipping faster with SageScript.</p>
    <button (click)="tryDemo.emit()"class="px-12 py-5 bg-highlight text-white rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-all">
      Book a Demo →
    </button>
  </div>
</section>

<section id="faq" class="reveal max-w-4xl mx-auto px-6 py-32">
  <div class="text-center mb-16">
    <span class="text-highlight font-black uppercase text-[10px] tracking-[0.3em]">FAQ</span>
    <h2 class="text-5xl font-black mt-4 text-text-default">Common Questions</h2>
  </div>

  <div class="space-y-4">
    <div *ngFor="let item of faqs; let i = index" 
         class="border border-border-default rounded-2xl overflow-hidden bg-bg-secondary/50 transition-all"
         [ngClass]="{'border-highlight/50 shadow-lg shadow-highlight/5': activeFaqIndex === i}">
      
      <button (click)="toggleFaq(i)" 
              class="w-full p-6 flex items-center justify-between text-left hover:bg-bg-primary/40 transition-colors group">
        <span class="font-bold text-text-default group-hover:text-highlight transition-colors">{{ item.question }}</span>
        <svg [ngClass]="{'rotate-180 text-highlight': activeFaqIndex === i}" 
             class="w-5 h-5 text-gray-500 transition-transform duration-300" 
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <div [style.max-height]="activeFaqIndex === i ? '1000px' : '0'" 
     class="faq-content overflow-hidden bg-bg-primary/20">
  <p class="p-6 text-gray-500 leading-relaxed border-t border-border-default">
    {{ item.answer }}
  </p>
</div>
    </div>
  </div>
</section>

<footer class="bg-bg-secondary border-t border-border-default pt-20 pb-10">
  <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
    
    <div class="lg:col-span-2 space-y-6">
      <img src="/assets/Sagescript-logo.png" alt="Logo" class="h-10">
      <p class="text-gray-500 max-w-sm leading-relaxed">
        AI-powered test automation for modern QA teams. Transform user stories into executable scripts instantly.
      </p>
      <div class="flex space-x-4">
        <a href="#" class="text-gray-400 hover:text-highlight transition-colors">Twitter</a>
        <a href="#" class="text-gray-400 hover:text-highlight transition-colors">LinkedIn</a>
        <a href="#" class="text-gray-400 hover:text-highlight transition-colors">GitHub</a>
      </div>
    </div>

    <div *ngFor="let group of footerLinks">
      <h4 class="font-black text-text-default uppercase text-xs tracking-widest mb-6">{{ group.title }}</h4>
      <ul class="space-y-4">
        <li *ngFor="let link of group.links">
          <a href="#" class="text-gray-500 hover:text-highlight transition-colors text-sm font-medium">{{ link }}</a>
        </li>
      </ul>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-6 pt-10 border-t border-border-default flex flex-col md:flex-row justify-between items-center text-gray-600 text-[10px] font-bold uppercase tracking-widest">
    <p>© 2026 SageScript AI. All rights reserved.</p>
    <div class="flex space-x-6 mt-4 md:mt-0">
      <a href="#" class="hover:text-highlight">Privacy Policy</a>
      <a href="#" class="hover:text-highlight">Terms of Service</a>
    </div>
  </div>
</footer>

      </main>
    </div>
  `,
  styleUrls: ['./landing-page.component.scss'],
 
 styles: [`
//  .reveal {
//       opacity: 0;
//       transform: translateY(30px);
//       transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
//     }

//     .reveal.active {
//       opacity: 1;
//       transform: translateY(0);
//     }

    .card-reveal {
      transition: all 0.5s ease;
    }

    .card-reveal:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(139, 123, 253, 0.1);
    }
    .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    .animate-fade-up { animation: fadeUp 1s ease-out forwards; }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class LandingPageComponent implements AfterViewInit{
  theme = inject(ThemeService);
    @Output() getStarted = new EventEmitter<void>();
    @Output() tryDemo = new EventEmitter<void>();
   featuredPosts = BLOG_POSTS; 
   sanitizer = inject(DomSanitizer);
  capabilities = [
    { title: 'The Bulk Intelligence Engine', desc: 'Process multiple user stories simultaneously with parallel AI agents delivering comprehensive test suites.', icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-width="2"/>') },
    { title: 'Transparent Agentic Reasoning', desc: 'Watch AI agents think in real-time — trace logic mapping, edge case detection, and data model validation.', icon:this.sanitizer.bypassSecurityTrustHtml( '<path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-width="2"/>' )},
    { title: 'Enterprise-Grade Maintenance', desc: 'Hierarchical folder systems and historical tracking keep your test suites organized at any scale.', icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-width="2"/>' )},
    { title: 'Seamless CI/CD Integration', desc: 'Export to Playwright, Selenium, or Cypress and push directly to GitHub with Jira linking.', icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M8 9l4-4 4 4m0 6l-4 4-4-4" stroke-width="2"/>' ) }
  ];

  features = [
    { tag: 'Bulk Processing', title: 'Bulk Story Processing: From Backlog to Script', desc: 'Stop wasting hours on manual entry. SageScript Bulk Generation Mode allows you to input multiple stories and acceptance criteria simultaneously.', img: '/assets/bulk.jpg' },
    { tag: 'Radical Transparency', title: 'Watch the AI Think: Live Agent Trace', desc: 'Open the Agent Status Modal to witness the live thought process of our Quality Strategist and Automation Builder agents.', img: '/assets/agent.jpg' },
    { tag: 'The Command Center', title: 'Unified Dashboard & History', desc: 'Track the entire quality history of your enterprise projects. Our folder system ensures maintainable organization at any volume.', img: '/assets/dash.jpg' },
    { tag: 'CI/CD Ready', title: 'GitHub & Jira Ecosystem', desc: 'Don\'t just generate—deploy. Export framework-specific bundles and push code directly to your repositories in under 60 seconds.', img: '/assets/jira.jpg' }
  ];

  stats = [
    { val: '30+', label: 'Daily Jobs' },
    { val: '100TB', label: 'Data Processed' },
    { val: '500+', label: 'Assisted Businesses' }
  ];

  benefits = [
    { title: '80%', sub: 'Efficiency Gain', icon:this.sanitizer.bypassSecurityTrustHtml( '<path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" stroke-width="2"/>') },
    { title: 'Smooth', sub: 'User Experience', icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/>' )},
    { title: '24/7', sub: 'Access & Support', icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/>' )},
    { title: '< 2m', sub: 'Cycle Time', icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/>') },
    { title: 'Zero', sub: 'Setup Overhead', icon:this.sanitizer.bypassSecurityTrustHtml( '<path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke-width="2"/>') },
    { title: '∞', sub: 'Scalability', icon: this.sanitizer.bypassSecurityTrustHtml('<path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-width="2"/>' )}
  ];
  testimonials = [
    {
      quote: "SageScript reduced our test creation time by 80%. The AI-generated cases catch edge cases our team would have missed.",
      author: "Priya Sharma",
      role: "QA Lead, TechNova Inc."
    },
    {
      quote: "The transparency of watching AI agents reason through test logic gave our entire team confidence in the generated output.",
      author: "Marcus Chen",
      role: "Co-founder, DevStream Labs"
    },
    {
      quote: "We went from manual test writing to fully automated CI/CD pipelines in under a week. Game changer for our startup.",
      author: "Aisha Patel",
      role: "Software Designer, PixelForge Studio"
    }
  ];
  team = [
    { initials: 'RP', name: 'Raj Pillai', title: '' },
    { initials: 'AK', name: 'Anandakrishnan Kc', title: '' },
    { initials: 'R', name: 'Ritesh', title: '' },
      { initials: 'SL', name: 'Shambulingaiah BM', title: '' },
    { initials: 'PP', name: 'Parvathi Pradeep', title: '' }
  ];
  activeFaqIndex: number | null = null;

  faqs = [
    { 
      question: "What types of test cases does SageScript generate?", 
      answer: "SageScript generates functional, API, and database layer test cases including positive, negative, edge-case, and boundary scenarios—all from your user stories and acceptance criteria." 
    },
    { 
      question: "Can I integrate SageScript with my existing CI/CD pipeline?", 
      answer: "Yes. SageScript exports framework-specific bundles for Playwright, Selenium, and Cypress. You can push directly to GitHub and link results to Jira." 
    },
    { 
      question: "How does the AI reasoning transparency work?", 
      answer: "Through our Agent Trace feature, you can see the step-by-step logic our agents used to derive specific test cases, ensuring 100% traceability." 
    },
    { 
      question: "Is my data secure?", 
      answer: "Absolutely. We use enterprise-grade encryption and do not use your proprietary requirement data to train our base models." 
    },
    { 
      question: "What's included in the free trial?", 
      answer: "Our free trial includes 10 demo attempts, full access to the project organization tool, and basic export capabilities." 
    }
  ];

  footerLinks = [
    { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
    { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
    { title: 'Resources', links: ['Documentation', 'API Reference', 'Community', 'Support'] }
  ];

  toggleFaq(index: number) {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }

constructor(private title: Title, private meta: Meta) {
  this.title.setTitle('SageScript | Agentic AI Test Automation');
  this.meta.updateTag({ 
    name: 'description', 
    content: 'The first agentic test platform that transforms requirements into production-ready test suites in seconds.' 
  });
}
  ngAfterViewInit() {
    // We look for the scroll container in the Shell component
    const scrollContainer = document.querySelector('.custom-scrollbar');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      // Use the shell's main area as the viewport
      root: scrollContainer, 
      threshold: 0.1 
    });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }
  
}