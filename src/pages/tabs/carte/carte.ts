import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { MapsProvider } from '../../../providers/maps/maps';
import { UserProvider } from '../../../providers/user/user';

declare var google;

@IonicPage()
@Component({
  selector: 'page-carte',
  templateUrl: 'carte.html',
})
export class CartePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];
  subjects = ['bien-etre', 'musculation', 'psychologue'];
  selectedSubject = "bien-etre";

  constructor(private geolocation: Geolocation,
    public mapService: MapsProvider,
    private userP: UserProvider) {

  }

  subjectName(sub) {
    if (sub == 'bien-etre')
      return 'bien etre'
    if (sub == 'musculation')
      return 'remise en forme'
    if (sub == 'psychologue')
      return 'praticiens'
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  selectThisSubject(sub) {
    this.selectedSubject = sub;
    this.getPlaces(this.selectedSubject);
  }

  loadMap() {

    this.geolocation.getCurrentPosition({timeout: 1000})
      .then(loc => {
        let latLng = new google.maps.LatLng(loc.coords.latitude, loc.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        
        if (this.userP.user.admin)
          this.map.addListener('click', (e) => {
            this.mapService.addMarkertosector({ lat: e.latLng.lat(), lng: e.latLng.lng() }, this.selectedSubject).subscribe()
          });

        this.getPlaces(this.selectedSubject);

      })
      .catch(() => {
        let latLng = new google.maps.LatLng(48.8700, 2.1843);

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        
        if (this.userP.user.admin)
          this.map.addListener('click', (e) => {
            this.mapService.addMarkertosector({ lat: e.latLng.lat(), lng: e.latLng.lng() }, this.selectedSubject).subscribe()
          });

        this.getPlaces(this.selectedSubject);
      })

  }

  getPlaces(sector) {

    this.mapService.getPlacesBySector(sector).subscribe(data => {
      console.log('getPlacesBySector', data);
      this.markers.forEach(marker => {
        marker.setMap(null);
      });
      this.markers = [];
      if (data) {
        data['places'].forEach(element => {
          let marker = new google.maps.Marker({
            map: this.map,
            position: element
          });
          if (this.userP.user.admin)
            marker.addListener('click', (e) => {
              this.mapService.deleteMarker(sector, this.markers.indexOf(marker)).subscribe()
            });
          this.markers.push(marker)
        });
      }
    });
  }

}
