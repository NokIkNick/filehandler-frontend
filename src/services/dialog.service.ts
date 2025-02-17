import { inject, Injectable, Type } from '@angular/core';
import {MatDialog} from '@angular/material/dialog'

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  readonly dialog = inject(MatDialog)

  displayDialogWithComponent(c: Type<any>, config?: any){
    const dialogref = this.dialog.open(c, config);
    dialogref.afterClosed().subscribe(_ => {
      console.log(`Dialog configs:`, config)
    })
  }


  displayDialogWithAfterEffect(component: Type<any>, callback: () => void){
    const dialogref = this.dialog.open(component);
    dialogref.afterClosed().subscribe((_) => {
      callback.call(this)
      console.log("hello")
    });
  }
}
