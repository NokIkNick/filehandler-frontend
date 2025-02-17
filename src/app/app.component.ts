import { Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, DashboardComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <app-dashboard></app-dashboard>
    <app-footer></app-footer> 
  `,
  styles: `
    
  `
})
export class AppComponent {
}
