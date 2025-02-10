import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, DashboardComponent],
  template: `
    <app-header></app-header>
    <app-dashboard></app-dashboard>
  `,
  styles: `
    
  `
})
export class AppComponent {
}
