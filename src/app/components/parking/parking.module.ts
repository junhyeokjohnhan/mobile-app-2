import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ParkingRoutingModule } from './parking-routing.module';
import { ParkingComponent } from './parking.component';


@NgModule({
  declarations: [ ParkingComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParkingRoutingModule
  ]
})
export class ParkingModule { }
