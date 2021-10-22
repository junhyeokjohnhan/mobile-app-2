import { Component, OnInit } from '@angular/core';
import { Parking } from '../../interfaces/parking';

@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.scss'],
})
export class ParkingComponent implements OnInit {
  newParking: Parking;
  parkings: Parking[];
  message: string;

  constructor() {
    this.initializeNewParking();
    this.initializeParkings();
  }

  ngOnInit() {}

  initializeNewParking(): void {
    this.newParking = { registration: "", hours: 0, charge: 2, runningTotal: 0 };
  }

  initializeParkings(): void {
    this.parkings = [];
  }

  calculateCharges(): void {
    this.message = '';

    if (this.parkings.filter(parking => parking.registration == this.newParking.registration).length > 0) {
      this.message += "There is an existing parking with the same registration!\n";
    } else if (this.newParking.hours > 24) {
      this.message += "Parking hour cannot exceed 24 hours!\n";
    } else {
      // Calculate the charge
      if (this.newParking.hours > 3) {
        this.newParking.charge += (this.newParking.hours - 3) * 0.25;
      }

      this.newParking.charge = this.newParking.charge > 10 ? 10 : this.newParking.charge;

      // Add it to the list
      this.parkings.push(this.newParking);

      // Calculate the running total
      let total = 0;
      this.parkings.forEach(parking => {
        total += parking.charge;
      });
      this.newParking.runningTotal = total;

      // Reset the new parking
      this.initializeNewParking(); 
    }
  }

  resetCharges(): void {
    this.initializeParkings();
  }
}
