import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'detalhe-atividades',
  templateUrl: './detalhe-atividades.component.html',
  styleUrls: ['detalhe-atividades.component.css']
})
export class DetalheAtividadesComponent implements OnInit, OnDestroy, ViewDidEnter {

  constructor() { }

  ngOnInit() { }
  ionViewDidEnter() { }


  /** Remove map when we have multiple map object */
  ngOnDestroy() {
  }
}
