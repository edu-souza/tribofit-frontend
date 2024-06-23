import { Component, OnInit, OnDestroy } from '@angular/core';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'detalhe-evento',
  templateUrl: './detalhe-evento.component.html',
  styleUrls: ['detalhe-evento.component.css']
})
export class DetalheEventoComponent implements OnInit, OnDestroy, ViewDidEnter {

  constructor() { }

  ngOnInit() { }
  ionViewDidEnter() { }


  /** Remove map when we have multiple map object */
  ngOnDestroy() {
  }
}
