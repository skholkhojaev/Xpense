import { Component, OnInit, Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() latitude: number = 0;
  @Input() longitude: number = 0;
  private map: L.Map | null = null;

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.latitude, this.longitude],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    L.marker([this.latitude, this.longitude]).addTo(this.map);
  }
}

