import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'detalhe-evento',
  templateUrl: './detalhe-eventos.component.html',
  styleUrls: ['detalhe-eventos.component.css']
})
export class DetalheAtividadesComponent implements OnInit, OnDestroy, ViewDidEnter {

  constructor() { }

  ngOnInit() { }
  ionViewDidEnter() { }


  /** Remove map when we have multiple map object */
  ngOnDestroy() {
  }
}
