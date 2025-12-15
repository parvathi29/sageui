import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestAutomationShellComponent } from './shared/components/test-automation-shell/test-automation-shell.component';
@Component({
  selector: 'app-root',
  standalone: true,
  // imports: [RouterOutlet],
  imports: [ TestAutomationShellComponent],
  // templateUrl: './app.component.html',
  // styleUrl: './app.component.scss'
  template: '<app-test-automation-shell></app-test-automation-shell>',
  styles: [],
})
export class AppComponent {
  title = 'sagescript';
}
