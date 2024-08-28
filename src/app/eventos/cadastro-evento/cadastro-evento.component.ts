import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import { EventoService } from '../services/evento.service';
import { Evento } from '../types/evento.interface';
import { Cidade } from 'src/app/core/cidade.interface';
import { CidadesService } from 'src/app/core/cidade-service';
import { Subscription } from 'rxjs';
import { Modalidade } from 'src/app/modalidades/types/modalidade.interface';
import { ModalidadesService } from 'src/app/modalidades/services/modalidades.services';
import { Usuario } from 'src/app/usuarios/types/usuario.interface';
import * as L from 'leaflet';
import { GeocodingService } from 'src/app/core/geocoding/geocoding.service';
import { AlertController } from "@ionic/angular";

@Component({
  selector: 'cadastro-evento',
  templateUrl: './cadastro-evento.component.html',
  styleUrls: ['./cadastro-evento.component.css']
})
export class CadastroEventoComponent implements OnInit {
  eventoId!: string;
  eventosForm: FormGroup;
  cidades: Cidade[] = [];
  modalidades: Modalidade[] = [];
  inclusao : boolean = false;
  title: string = '';
  imagemEvento : string = '';
  file : string = '';
  participantes : Usuario[] = [];
  map : any = '';
  numLatitude: number = 0;
  numLongitude: number = 0;
  marcadorAtual: L.Marker | null = null;
  isAdmin : boolean = true;

  myIcon = L.icon({
    iconUrl: 'assets/icon/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'assets/icon/marker-shadow.png',
    shadowSize: [41, 41]
  });

  constructor(
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private eventoService: EventoService,
    private cidadeService: CidadesService,
    private modalidadeService: ModalidadesService,
    private geocodingService: GeocodingService,
    private router: Router
  ) {
    this.eventosForm = this.createForm();
  }

  ngOnInit() {
    this.loadCidades();
    this.loadModalidades();

    this.loadEvento().then(() => {
      this.inicializarMapa();
    });
  }

  private inicializarMapa() {
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  
    const centraliza: [number, number] = this.inclusao
      ? [-28.68019691064019, -49.37417939453497]
      : [this.numLatitude, this.numLongitude];
  
    this.map = L.map('map', {
      center: centraliza,
      zoom: 15,
      renderer: L.canvas(),
    });
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'edupala.com © Angular LeafLet',
    }).addTo(this.map);
  
    if (!this.inclusao && this.numLatitude && this.numLongitude) {
      this.marcadorAtual = L.marker([this.numLatitude, this.numLongitude], { icon: this.myIcon });
      this.marcadorAtual.addTo(this.map);
    }
  
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  
    if(this.isAdmin){
      this.map.on('click', this.onMapClick.bind(this));
    }
  }
  
  onMapClick(e: L.LeafletMouseEvent) {
    this.numLatitude = e.latlng.lat;
    this.numLongitude = e.latlng.lng;
    this.GetEndereco(this.numLatitude, this.numLongitude);
  
    if (this.marcadorAtual) {
      this.map.removeLayer(this.marcadorAtual);
    }
  
    this.marcadorAtual = L.marker([this.numLatitude, this.numLongitude], { icon: this.myIcon });
    this.marcadorAtual.addTo(this.map);
  }
  

  GetEndereco(latitude: number, longitude: number) {
    this.geocodingService.getAddressFromCoordinates(latitude, longitude).subscribe(
      (data) => {
        const endereco = `${data.address.road}, ${data.address.suburb}, ${data.address.town || data.address.city}`;
        this.alertController.create({
          header: 'Confirme o endereço do evento',
          message: `Confirma ${endereco} como endereço do evento?`,
          buttons: [
            {
              text: 'Sim',
              handler: () => {
                this.eventosForm.patchValue({ rua: data.address.road, bairro: data.address.suburb,latitude: latitude,longitude: longitude});
              }
            },
            {
              text: 'Não',
              handler: () => {
                if (this.marcadorAtual) {
                  this.map.removeLayer(this.marcadorAtual);
                }
              }
            }
          ]
        }).then(alert => alert.present());
      },
      (error) => {
        console.error('Erro ao obter o endereço:', error);
      }
    );
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

  loadModalidades() {
    const observable = this.modalidadeService.getModalidade();
    observable.subscribe(
      (dados) => {
        this.modalidades = dados;
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
        this.inclusao = false;
        this.title = evento.titulo;
        this.imagemEvento = evento.imagem;
        this.participantes = evento.usuarios
        this.numLatitude = parseFloat(evento.latitude);
        this.numLongitude = parseFloat(evento.longitude);
      } else {
        console.error(`Evento não encontrado.`);
      }
    } else {
      this.inclusao = true;
    }
  }

  private createForm(evento?: Evento) {
    const form = new FormGroup({
      titulo: new FormControl({ value: evento?.titulo || '', disabled: !this.isAdmin }, Validators.required),
      descricao: new FormControl({ value: evento?.descricao || '', disabled: !this.isAdmin }, Validators.required),
      tipo: new FormControl({ value: evento?.tipo || '', disabled: !this.isAdmin }, Validators.required),
      data: new FormControl({ value: evento?.data ? new Date(evento.data).toISOString() : this.toLocalISOString(new Date()), disabled: !this.isAdmin }, Validators.required),
      hora: new FormControl({ value: evento?.hora ? new Date(evento.hora).toISOString() : this.toLocalISOString(new Date()), disabled: !this.isAdmin }, Validators.required),
      diaSemana: new FormControl({ value: evento?.diaSemana || '', disabled: !this.isAdmin }),
      quantidadeParticipantes: new FormControl({ value: evento?.quantidadeParticipantes || 0, disabled: !this.isAdmin }),
      bairro: new FormControl({ value: evento?.bairro || '', disabled: !this.isAdmin }, Validators.required),
      rua: new FormControl({ value: evento?.rua || '', disabled: !this.isAdmin }, Validators.required),
      latitude: new FormControl({ value: evento?.latitude || '', disabled: !this.isAdmin }),
      longitude: new FormControl({ value: evento?.longitude || '', disabled: !this.isAdmin }),
      admin: new FormControl({ value: evento?.admin || '', disabled: !this.isAdmin }),
      status_aprov: new FormControl({ value: evento?.status_aprov || '', disabled: !this.isAdmin }),
      numero: new FormControl({ value: evento?.numero || '', disabled: !this.isAdmin }, Validators.required),
      complemento: new FormControl({ value: evento?.complemento || '', disabled: !this.isAdmin }),
      status: new FormControl({ value: evento?.status || 'A', disabled: !this.isAdmin }, Validators.required),
      cidade: new FormControl({ value: evento?.cidade || '', disabled: !this.isAdmin }, Validators.required),
      modalidade: new FormControl({ value: evento?.modalidade || '', disabled: !this.isAdmin }, Validators.required),
      imagem: new FormControl({ value: evento?.imagem || '', disabled: !this.isAdmin })
    });
  
    return form;
  }

  toLocalISOString(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

    const timezoneOffset = -date.getTimezoneOffset();
    const sign = timezoneOffset >= 0 ? '+' : '-';
    const offsetHours = pad(Math.floor(Math.abs(timezoneOffset) / 60));
    const offsetMinutes = pad(Math.abs(timezoneOffset) % 60);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${offsetHours}:${offsetMinutes}`;
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
      hora: this.formatarHora(evento.hora),
      diaSemana: evento.diaSemana,
      quantidadeParticipantes: evento.quantidadeParticipantes,
      bairro: evento.bairro,
      rua: evento.rua,
      latitude:evento.latitude,
      longitude: evento.longitude,
      admin: evento.admin,
      status_aprov: evento.status_aprov,
      numero: evento.numero,
      complemento: evento.complemento,
      status: evento.status,
      cidade: evento.cidade,
      modalidade: evento.modalidade,
    });
  }

  private formatarHora(time: string): string {
    const [hours, minutes, seconds] = time.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes, +seconds);
    return this.toLocalISOString(date)
  }

  extrairHora(dateString: string): string {
    const date = new Date(dateString);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  saveEvento() {
    const evento: Evento = {
      ...this.eventosForm.value,
      id: this.eventoId,
    };
    evento.hora = this.extrairHora(evento.hora);
    evento.imagem = this.imagemEvento;
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
  
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const fileType = selectedFile.type.split('/')[0];
      //&& selectedFile.size <= 512000 RESTRINGIR TAMANHO
      if (fileType === 'image' ) {
        this.file = selectedFile;
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          this.imagemEvento = e.target?.result as string;
        };
        reader.readAsDataURL(selectedFile);
      } else {
        window.alert("Tamanho inválido!");
      }
    }
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

  get diaSemana() {
    return this.eventosForm.get('diaSemana');
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

  get status() {
    return this.eventosForm.get('status');
  }

  get cidade() {
    return this.eventosForm.get('cidade');
  }

  get modalidade() {
    return this.eventosForm.get('modalidade');
  }

  get latitude() {
    return this.eventosForm.get('latitude');
  }

  get longitude() {
    return this.eventosForm.get('longitude');
  }

  get admin() {
    return this.eventosForm.get('admin');
  }

  get status_aprov() {
    return this.eventosForm.get('status_aprov');
  }

  
  get imagem() {
    return this.eventosForm.get('imagem');
  }


}
