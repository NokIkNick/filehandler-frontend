import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  imports: [],
  template: `
    <p>{{message}}</p>
  
  `,
  styles: `
  
  `
})
export class MessageComponent {
  @Input() message?: string;
}
