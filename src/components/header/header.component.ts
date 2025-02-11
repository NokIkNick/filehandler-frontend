import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  template: `
  <div class="header">
    <h1>Filehandler</h1>
  </div>
  `,
  styles: `
  .header{
    width: auto;
    height: auto;
    align-items: left;
    background: radial-gradient(ellipse at left, rgb(179, 213, 233) -50%, #27374D) 100%; 
  }
  
  h1{
    color:white;
    margin: auto;
    padding: 10px;
    text-align: left;
    font-size: 3rem;
    text-shadow: 0px 2px 0px #abc, 0px 4px 10px rgba(0, 0, 0, 0.15), 0px 5px 2px rgba(0, 0, 0, 0.1), 0px 6px 30px rgba(0, 0, 0,0);
    
  }
  
  `
})
export class HeaderComponent {

}
