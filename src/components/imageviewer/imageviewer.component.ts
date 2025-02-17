import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-imageviewer',
  imports: [],
  template: `

    <img [src]="images.get(imageToShow!)" style="position: fixed; top: {{randomTop}}px; bottom: {{randomBottom}}px; right: {{randomRight}}px; left: {{randomLeft}}px">
  `,
  styles: ``
})
export class ImageviewerComponent implements OnInit{
  partAmount: number;
  imageToShow?: number;
  images: Map<number, string> = new Map<number, string>([
    [0,"/assets/images/images.jpg"],
    [1,"/assets/images/tumblr_7c4aaf2850fd206da330d04509fd9939_0cf88b33_1280.jpg"],
    [2, "/assets/images/yes-sweating.gif"],
    [3, "/assets/images/this-is-fine_custom-b7c50c845a78f5d7716475a92016d52655ba3115.jpg"]
  ])

  randomLeft?:number; 
  randomRight?:number; 
  randomTop?:number; 
  randomBottom?:number;

  //

  constructor(){
    const injected = inject(MAT_DIALOG_DATA) as {partAmount: number};
    this.partAmount = {...injected}.partAmount;
    console.log(this.partAmount, "part amount");
  }

  ngOnInit(): void {
    this.randomLeft = Math.random() * 100;
    this.randomRight = Math.random() * 100;
    this.randomTop = Math.random() * 100;
    this.randomBottom = Math.random() * 100;
    this.calculateImageToShow(this.partAmount);
    
    
  }


  calculateImageToShow(parts: number){
    if(parts > 5000){
      this.imageToShow = 3;
    }else if(parts > 1000) {
      this.imageToShow = 2;
    }else if(parts > 500){
      this.imageToShow = 1;
    }else if (parts > 100){
      this.imageToShow = 0;
    }
  }

}
