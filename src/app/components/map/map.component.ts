import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import { Geolocation } from '@capacitor/geolocation';
import { LatLng } from '@capacitor-community/capacitor-googlemaps-native/dist/esm/types/common/latlng.interface';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild('map') mapView: ElementRef;
  constructor(private alertCtrl: AlertController) { }

  dorsetLocation: LatLng = { latitude: 53.3581716, longitude: -6.2573791 };
  currentLocation?: LatLng;

  reinitialized: boolean = false;

  ngOnInit() {}

  ionViewDidEnter() {
    this.createMap();
  }

  ionViewDidLeave() {
    this.destroyMap();
  }
  
  createMap() { 
    const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;
    console.log("Bounding rect: ", boundingRect);

    CapacitorGoogleMaps.create({
      width: Math.round(boundingRect.width),
      height: Math.round(boundingRect.height),
      x: Math.round(boundingRect.x),
      y: Math.round(boundingRect.y),
      latitude: this.currentLocation != null ? this.currentLocation.latitude : this.dorsetLocation.latitude,
      longitude: this.currentLocation != null ? this.currentLocation.longitude : this.dorsetLocation.longitude,
      zoom: 12
    });

    CapacitorGoogleMaps.addListener('onMapReady', async () => {
      CapacitorGoogleMaps.setMapType({
        type: 'normal' // Could be satellite, terrain, or hybrid
      });

      // Enable buttons so user can zoom out
      CapacitorGoogleMaps.settings({
        myLocationButton: true
      });

      this.showCurrentPosition();

      CapacitorGoogleMaps.addListener('didTapPOIWithPlaceID', async (ev) => {
        const result = ev.results;
        const alert = await this.alertCtrl.create({
          header: result.name,
          message: 'place ID: ${result.placeID}',
          buttons: ['OK']
        });
        await alert.present();
      });
    });
  }

  destroyMap() {
    CapacitorGoogleMaps.clear();
    CapacitorGoogleMaps.hide();
    CapacitorGoogleMaps.close();
  }

  showCurrentPosition() {
    Geolocation.requestPermissions().then(async permission => {
      const coordinates = await Geolocation.getCurrentPosition();
      
      this.currentLocation = { latitude: coordinates.coords.latitude, longitude: coordinates.coords.longitude };

      CapacitorGoogleMaps.addMarker({
        latitude: this.currentLocation.latitude,
        longitude: this.currentLocation.longitude,
        title: 'Your location',
        snippet: 'You are currently at this location.'
      });

      // setCamera() has open issue!
      // https://github.com/capacitor-community/capacitor-googlemaps-native/issues/40

      // CapacitorGoogleMaps.setCamera({
      //   latitude: this.currentLocation.latitude,
      //   longitude: this.currentLocation.longitude,
      //   zoom: 12,
      //   bearing: 0
      // });

      // Instead of using 'buggy' setCamera(), initialize another map with the current location
      if (this.reinitialized == false) {
        this.destroyMap();

        this.createMap();
        
        this.reinitialized = true;
      }
    });
  }

  draw() {
    const points: LatLng[] = [this.currentLocation, this.dorsetLocation]
    CapacitorGoogleMaps.addPolyline({points, color: '#ff00ff', width: 2});
  }
}
