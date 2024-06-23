import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import { EventoService } from '../services/evento.service';
import { Evento } from '../types/evento.interface';
import { Cidade } from 'src/app/core/cidade.interface';
import { CidadesService } from 'src/app/core/cidade-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cadastro-eventos',
  templateUrl: './cadastro-eventos.component.html',
  styleUrls: ['./cadastro-eventos.component.css']
})
export class CadastroEventosComponent implements OnInit {
  eventoId!: string;
  eventosForm: FormGroup;
  cidades: Cidade[] = [];

  constructor(
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private eventoService: EventoService,
    private cidadeService: CidadesService,
    private router: Router
  ) {
    this.eventosForm = this.createForm();
  }

  ngOnInit() {
    this.loadEvento();
    this.loadCidades();
  }

  loadCidades() {
    const observable = this.cidadeService.getCidade();
    observable.subscribe(
      (dados) => {
        this.cidades = dados;
      },
      (erro) => {
        console.error(erro);
        this.toastController
          .create({
            message: `Erro ao listar registros`,
            duration: 5000,
            keyboardClose: true,
            color: 'danger',
          })
          .then((t) => t.present());
      }
    );
  }

  private async loadEvento() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.eventoId = id;
      const evento = await this.eventoService.getEventoById(this.eventoId).toPromise();
      if (evento) {
        this.setFormValues(evento);
      } else {
        console.error(`Evento não encontrado.`);
      }
    }
  }

  private createForm(evento?: Evento) {
    return new FormGroup({
      titulo: new FormControl(evento?.titulo || '', Validators.required),
      descricao: new FormControl(evento?.descricao || '', Validators.required),
      tipo: new FormControl(evento?.tipo || '', Validators.required),
      data: new FormControl(evento?.data ? new Date(evento.data).toISOString() : new Date().toISOString(), Validators.required),
      hora: new FormControl(evento?.hora ? new Date(evento.hora).toISOString() : new Date().toISOString(), Validators.required),
      diasemana: new FormControl(evento?.diasemana || ''),
      quantidadeParticipantes: new FormControl(evento?.quantidadeParticipantes || 0, [Validators.required, Validators.min(1)]),
      bairro: new FormControl(evento?.bairro || '', Validators.required),
      rua: new FormControl(evento?.rua || '', Validators.required),
      numero: new FormControl(evento?.numero || '', Validators.required),
      complemento: new FormControl(evento?.complemento || ''),
      status: new FormControl(evento?.status || 'A', Validators.required),
      cidade: new FormControl(evento?.cidade || '', Validators.required)
    });
  }

  compareWith(o1: Cidade, o2: Cidade) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  private setFormValues(evento: Evento) {
    this.eventosForm.patchValue({
      titulo: evento.titulo,
      descricao: evento.descricao,
      tipo: evento.tipo,
      data: new Date(evento.data).toISOString(),
      hora: this.formatTimeForForm(evento.hora),
      diasemana: evento.diasemana,
      quantidadeParticipantes: evento.quantidadeParticipantes,
      bairro: evento.bairro,
      rua: evento.rua,
      numero: evento.numero,
      complemento: evento.complemento,
      status: evento.status,
      cidade: evento.cidade,
    });
  }

  private formatTimeForForm(time: string): string {
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes, +seconds);
    return date.toISOString();
  }

  private formatTimeForDB(date: Date): string {
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  saveEvento() {
    const evento: Evento = {
      ...this.eventosForm.value,
      id: this.eventoId,
    };
    evento.hora = this.formatTimeForDB(new Date(evento.hora));
    this.eventoService.salvar(evento).subscribe(
      () => {
        this.toastController
          .create({
            message: 'Salvo com sucesso!',
            duration: 1000,
            keyboardClose: true,
            color: 'success',
          })
          .then((t) => t.present());
        this.router.navigate(['tabs/eventos'])
      },
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

  get titulo() {
    return this.eventosForm.get('titulo');
  }

  get descricao() {
    return this.eventosForm.get('descricao');
  }

  get tipo() {
    return this.eventosForm.get('tipo');
  }

  get data() {
    return this.eventosForm.get('data');
  }

  get hora() {
    return this.eventosForm.get('hora');
  }

  get diasemana() {
    return this.eventosForm.get('diasemana');
  }

  get quantidadeParticipantes() {
    return this.eventosForm.get('quantidadeParticipantes');
  }

  get bairro() {
    return this.eventosForm.get('bairro');
  }

  get rua() {
    return this.eventosForm.get('rua');
  }

  get numero() {
    return this.eventosForm.get('numero');
  }

  get complemento() {
    return this.eventosForm.get('complemento');
  }

  get latitude() {
    return this.eventosForm.get('latitude');
  }

  get longitude() {
    return this.eventosForm.get('longitude');
  }

  get status() {
    return this.eventosForm.get('status');
  }

  get cidade() {
    return this.eventosForm.get('cidade');
  }

}
