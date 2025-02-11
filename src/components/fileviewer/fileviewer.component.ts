import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fileviewer',
  imports: [],
  template: `
    <p>{{selected}}</p>
  `,
  styles: ``
})
export class FileviewerComponent {
  @Input() selected?: string;
}
