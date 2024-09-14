import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLateralComponent } from './menu/menu-lateral/menu-lateral.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MenuLateralComponent],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule
  ],
  exports:[MenuLateralComponent]
})
export class CoreModule { }
