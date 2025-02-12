import { Component, Input } from '@angular/core';
import {NgxDocViewerModule} from 'ngx-doc-viewer';


@Component({
  selector: 'app-fileviewer',
  imports: [NgxDocViewerModule],
  template: `
    <ngx-doc-viewer [url]='selected' viewer="url" style="width:auto; height:100%" >

    </ngx-doc-viewer>
  `,
  styles: ``
})
export class FileviewerComponent {
  @Input() selected!: string;
}
