import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserSession } from '../models/test-automation.model';
import { ApiService } from '../../../core/services/api.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-bg-primary p-6">
      <div class="w-full max-w-md bg-bg-secondary border border-border-default rounded-3xl shadow-2xl p-10 animate-fade-in shadow-highlight/5">
        <div class="flex flex-col items-center mb-8 text-center">
          <div class="p-3 bg-highlight/10 rounded-2xl mb-4">
             <svg width="40" height="40" viewBox="0 0 512 512"><path d="M259.92,262.91,216.4,149.77a9,9,0,0,0-16.8,0L156.08,262.91a9,9,0,0,1-5.17,5.17L37.77,311.6a9,9,0,0,0,0,16.8l113.14,43.52a9,9,0,0,1,5.17,5.17L199.6,490.23a9,9,0,0,0,16.8,0l43.52-113.14a9,9,0,0,1,5.17-5.17L378.23,328.4a9,9,0,0,0,0-16.8L265.09,268.08A9,9,0,0,1,259.92,262.91Z" fill="none" stroke="#8b7bfd" stroke-width="32"/></svg>
          </div>
          <h1 class="text-3xl font-black text-text-default tracking-tighter">Sage Script</h1>
          <p class="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest">Enterprise SSO Login</p>
        </div>

        <form (ngSubmit)="onLogin()" class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Username</label>
            <input type="text" [(ngModel)]="username" name="username" placeholder="Enter username" 
                   class="w-full p-4 bg-bg-primary border border-border-default rounded-2xl text-text-default outline-none focus:border-highlight transition-all">
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" 
                   class="w-full p-4 bg-bg-primary border border-border-default rounded-2xl text-text-default outline-none focus:border-highlight transition-all">
          </div>

          <button type="submit" [disabled]="loading" 
                  class="w-full py-4 bg-highlight hover:bg-purple-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-highlight/20 active:scale-95 disabled:opacity-50">
            {{ loading ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>
        
        <p class="mt-8 text-[10px] text-center text-gray-600 font-bold uppercase tracking-widest leading-relaxed">
          Authorized personnel only.<br>Access monitored by corporate security.
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {

  @Output() loginSuccess = new EventEmitter<any>();
  http = inject(HttpClient);
  username = '';
  password = '';
  loading = false;

constructor(private apiService: ApiService) {}

// onLogin() {
//   this.loading = true;
//   this.http.post<UserSession>('http://127.0.0.1:8000/api/login', { 
//     username: this.username, 
//     password: this.password 
//   })
//   .subscribe({
//     next: (user: UserSession) => {
//       this.loading = false;
//       this.loginSuccess.emit(user); 
//     },
//     error: () => {
//       this.loading = false;
//       alert('Invalid login credentials');
//     }
//   });
// }
onLogin(): void {
   this.loading = true; 
   this.apiService.login(this.username, this.password).subscribe(
    { next: (user: UserSession) => 
      { this.loading = false;
         this.loginSuccess.emit(user); 
        }, error: () => {
           this.loading = false;
            alert('Invalid login credentials');
           } 
          });
         }


}