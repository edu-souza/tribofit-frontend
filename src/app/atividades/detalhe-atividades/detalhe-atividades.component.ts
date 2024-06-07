import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'detalhe-atividades',
  templateUrl: './detalhe-atividades.component.html',
  styleUrls: ['detalhe-atividades.component.css']
})
export class DetalheAtividadesComponent implements OnInit, OnDestroy, ViewDidEnter {
  map!: Leaflet.Map;

  constructor() { }

  ngOnInit() { }
  ionViewDidEnter() { this.leafletMap(); }

  leafletMap() {
    this.map = Leaflet.map('mapId').setView([-28.680272552112328, -49.374696627026985], 15);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'edupala.com © Angular LeafLet',
    }).addTo(this.map);

    Leaflet.marker([-28.680272552112328, -49.374696627026985]).addTo(this.map).bindPopup('Ponto de encontro').openPopup();
    // Leaflet.marker([34, 77]).addTo(this.map).bindPopup('Leh').openPopup();

  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }
}
