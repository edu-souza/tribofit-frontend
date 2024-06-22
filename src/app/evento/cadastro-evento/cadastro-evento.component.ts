import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { EventoService } from '../services/evento.service';
import { Evento } from '../types/evento.interface';
@Component({
  selector: 'cadastro-eventos',
  templateUrl: './cadastro-evento.component.html',
  styleUrls: ['cadastro-evento.component.css']
})
export class CadastroEventoComponent {
  eventoId: string | null;
  eventosForm: FormGroup;

  constructor(private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private eventoService: EventoService,
    private router: Router) {
    this.eventoId = null;
    this.eventosForm = this.createForm();
  }

  ngOnInit() {
    this.loadEvento();
  }

  private async loadEvento() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.eventoId = id;
      const evento = await this.eventoService.getEventoById(this.eventoId).toPromise();
      if (evento) {
        console.log(evento)
        this.setFormValues(evento);
      } else {
        console.error(`Evento não encontrado.`);
      }
    }
  }

  private createForm(evento?: Evento) {
    return new FormGroup({
      titulo: new FormControl(evento?.titulo || '', [
        Validators.required,
      ]),
      descricao: new FormControl(evento?.descricao || '', [
        Validators.required,
      ]),
      tipo: new FormControl(evento?.tipo || '', [
        Validators.required,
      ]),
      data: new FormControl(
        evento?.data || new Date().toISOString()
      ),
      hora: new FormControl(
        evento?.hora || new Date().toISOString()
      ),
      diasemana: new FormControl(evento?.diasemana || '', [
        Validators.required,
      ]),
      quantidadeParticipantes: new FormControl(evento?.quantidadeParticipantes || 0, [Validators.required
      ]),
      bairro: new FormControl(evento?.bairro || '', [
        Validators.required,
      ]),
      rua: new FormControl(evento?.rua || '', [
        Validators.required,
      ]),
      numero: new FormControl(evento?.numero || '', [
        Validators.required,
      ]),
      complemento: new FormControl(evento?.complemento || '', [
        Validators.required,
      ]),
      latitude: new FormControl(evento?.latitude || '', [
        Validators.required,
      ]),
      longitude: new FormControl(evento?.longitude || '', [
        Validators.required,
      ]),
      status: new FormControl(evento?.status || '', [
        Validators.required,
      ]),
      cidade: new FormControl(evento?.cidade || '', [
        Validators.required,
      ])
    });
  }

  private setFormValues(evento: Evento) {
    this.eventosForm.patchValue({
      titulo: evento.titulo,
      descricao: evento.descricao,
      tipo: evento.tipo,
      data: evento.data,
      hora: evento.hora,
      diasemana: evento.diasemana,
      quantidadeParticipantes: evento.quantidadeParticipantes,
      bairro: evento.bairro,
      rua: evento.rua,
      numero: evento.numero,
      complemento: evento.complemento,
      latitude: evento.latitude,
      longitude: evento.longitude,
      status: evento.status,
      cidade: evento.cidade,
    });
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
