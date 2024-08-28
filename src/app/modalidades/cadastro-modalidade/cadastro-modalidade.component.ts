import { Component, OnInit } from '@angular/core';
import { ModalidadesService } from '../services/modalidades.services';
import { Router, ActivatedRoute } from '@angular/router';
import { Modalidade } from '../types/modalidade.interface';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'cadastro-modalidade',
  templateUrl: './cadastro-modalidade.component.html',
  styleUrls: ['./cadastro-modalidade.component.css']
})
export class CadastroModalidadeComponent implements OnInit {
  modalidadeId!: string;
  modalidadeForm: FormGroup;
  private subscriptions = new Subscription();

  icons = [
    { value: 'corrida.svg', label: 'Corrida' },
    { value: 'musculacao.svg', label: 'Musculação' },
    { value: 'rugby.svg', label: 'Rugby' },
    { value: 'futebol-americano.svg', label: 'Futebol Americano' },
    { value: 'handebol.svg', label: 'Handebol' },
    { value: 'skate.svg', label: 'Skate' },
    { value: 'baseball.svg', label: 'Baseball' },
    { value: 'tenis.svg', label: 'Tênis / Beach Tênis' },
    { value: 'natacao.svg', label: 'Natação' },
    { value: 'caminhada.svg', label: 'Caminhada / Trilha' },
    { value: 'basquete.svg', label: 'Basquete' },
    { value: 'volei.svg', label: 'Vôlei' },
    { value: 'futebol.svg', label: 'Futebol' }
  ];

  constructor(
    private modalidadeService: ModalidadesService,
    private router: Router,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute
  ) {
    this.modalidadeForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.modalidadeId = id;
      this.subscriptions.add(
        this.modalidadeService
          .getModalidadeById(this.modalidadeId)
          .subscribe((modalidade) => {
            this.modalidadeForm = this.createForm(modalidade);
          })
      );
    }
  }

  salvar() {
    const modalidade: Modalidade = {
      ...this.modalidadeForm.value,
      id: this.modalidadeId,
    };
    console.log(modalidade);
    this.modalidadeService.salvar(modalidade).subscribe(
      () => this.router.navigate(['tabs/modalidades']),
      (erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Não foi possível salvar o registro. ${erro.error.message}`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    );
  }

  private createForm(modalidade?: Modalidade) {
    return new FormGroup({
      icone: new FormControl(modalidade?.icone || '', [Validators.required]),
      nome: new FormControl(modalidade?.nome || '', [Validators.required]),
    });
  }

  get icone() {
    return this.modalidadeForm.get('icone');
  }

  get nome() {
    return this.modalidadeForm.get('nome');
  }
}
