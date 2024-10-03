import { Component, OnDestroy, OnInit } from "@angular/core";
import { ModalidadesService } from "../services/modalidades.services";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Modalidade } from "../types/modalidade.interface";
import { AlertController, ToastController, ViewDidEnter, ViewDidLeave, ViewWillEnter, ViewWillLeave } from "@ionic/angular";
import { menus } from "src/app/core/menu/menus";

@Component({
  selector: 'lista-modalidade',
  templateUrl: './lista-modalidade.component.html',
  styleUrls: ['./lista-modalidade.component.css']
})

export class ListaModalidadeComponent implements OnInit, OnDestroy, ViewWillEnter {
  modalidades: Modalidade[] = [];
  private subscriptions = new Subscription();
  menusMod = menus;

  constructor(
    private modalidadeService: ModalidadesService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
  }

  ionViewWillEnter(): void {
    this.listar();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.modalidadeService.getModalidade().subscribe(
        (response) => {
          (response);
          this.modalidades = response;
          this.listar();
        },
        (erro) => {
          console.log('Error occurred:', erro);
        }
      )
    );
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.listar();
      event.target.complete();
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  listar() {
    this.modalidadeService.getModalidade().subscribe(
      (dados) => {
        this.modalidades = dados;
      },
      (erro) => {
        console.error(erro);
      }
    );
  }

  confirmarExclusao(modalidade: Modalidade) {
    this.alertController.create({
      header: 'Confirmação de exclusão',
      message: `Deseja excluir a modalidade ${modalidade.nome}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => this.excluir(modalidade),
        },
        {
          text: 'Não',
        },
      ],
    })
      .then((alerta) => alerta.present());

  }

  private excluir(modalidade: Modalidade) {
    if (modalidade.id) {
      this.modalidadeService.excluir(modalidade.id).subscribe(
        () => this.listar(),
        (erro) => {
          this.toastController.create({
            position: 'top',
            duration: 5000,
            color: 'danger',
          })
        }
      );
    }
  }
}