import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ViewDidEnter, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
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
import { AuthService } from 'src/app/authentication/auth.service';
import { EventoUsuario } from '../types/evento_usuario.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuariosService } from 'src/app/usuarios/services/usuarios.services';
import { NotificacoesService } from 'src/app/notificacoes/services/notificacao.service';
import { Notificacao } from 'src/app/notificacoes/types/notificacao.interface';

@Component({
  selector: 'cadastro-evento',
  templateUrl: './cadastro-evento.component.html',
  styleUrls: ['./cadastro-evento.component.css']
})
export class CadastroEventoComponent implements OnInit,OnDestroy,ViewDidEnter,ViewWillLeave {
  eventoId!: string;
  eventosForm: FormGroup;
  cidades: Cidade[] = [];
  modalidades: Modalidade[] = [];
  participantesSelecionados: EventoUsuario[] = [];
  inclusao : boolean = false;
  title: string = '';
  imagemEvento : string = '';
  file : string = '';
  map : any = '';
  numLatitude: number = 0;
  numLongitude: number = 0;
  marcadorAtual: L.Marker | null = null;
  usuarioLogado: any;
  lAlteracao: boolean = true;
  isAdmin: boolean = false;
  isAnfitriao: boolean = false;
  eventoAdmin: string = '';
  myIcon = L.icon({
    iconUrl: 'assets/icon/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'assets/icon/marker-shadow.png',
    shadowSize: [41, 41]
  });
  evento = this.eventoService.getEventoById(this.eventoId).toPromise();

  constructor(
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private eventoService: EventoService,
    private usuarioService: UsuariosService,
    private cidadeService: CidadesService,
    private modalidadeService: ModalidadesService,
    private geocodingService: GeocodingService,
    private authService: AuthService,
    private router: Router,
    private notificacaoService: NotificacoesService
  ) {
    this.eventosForm = this.createForm();
    this.usuarioLogado = this.authService.getUsuarioLogado()
    this.isAdmin = this.usuarioLogado.acesso == 'admin' ? true : false;
    this.isAnfitriao = true;

    
  }

  ngOnInit() {
    this.loadCidades();
    this.loadModalidades();

    this.loadEvento().then(() => {
      this.inicializarMapa();
    });
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.off(); 
      this.map.remove();
      this.map = null; 
    }
  }

  ionViewWillLeave() {
    if (this.map) {
      this.map.off(); 
      this.map.remove(); 
      this.map = null; 
    }
  }

  ionViewDidEnter() {
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
  
    if(this.lAlteracao){
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
          header: 'Confirme o endereço do evenfto',
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

  private async loadEvento(): Promise<void> {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
  
    if (id) {
      this.eventoId = id;
      try {
        const evento = await this.eventoService.getEventoById(this.eventoId).toPromise();
        if (evento) {
          this.setFormValues(evento);
          this.inclusao = false;
          this.title = evento.titulo;
          this.imagemEvento = evento.imagem;
          this.participantesSelecionados = Object.values(evento.eventosUsuarios);
          this.numLatitude = parseFloat(evento.latitude);
          this.numLongitude = parseFloat(evento.longitude);
          this.lAlteracao = evento.admin === this.usuarioLogado.sub || this.isAdmin;
  
          this.eventoAdmin = await this.getAdmin(evento.admin) || 'Admin não encontrado';
          this.isAnfitriao = evento.admin === this.usuarioLogado.sub || this.isAdmin;
  
          for (const participante of this.participantesSelecionados) {
            if (participante.usuario.imagem) {
              const imagem = await this.loadImagem(participante.usuario.imagem);
              participante.imagem = imagem || ''; 
            }
          }
          console.log(this.participantesSelecionados)
  
          this.updateFormControls();
        } else {
          console.error(`Evento não encontrado.`);
        }
      } catch (error) {
        console.error('Erro ao carregar o evento:', error);
      }
    } else {
      this.inclusao = true;
    }
  }
  
  private async loadImagem(filename: string): Promise<string | null> {
    try {
      const blob = await this.usuarioService.getImagem(filename).toPromise();
  
      if (blob) {
        return await this.blobToBase64(blob);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao carregar a imagem do usuário 2:', error);
      return null;
    }
  }
  
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string); 
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  }

  async getAdmin(adminId: string): Promise<string | undefined> {
    const usuario = await this.usuarioService.getUsuarioById(adminId).toPromise();
    if (usuario) {
      return usuario.nome;  
    } else {
      console.error('Admin não encontrado.');
      return undefined; 
    }
  }
  private createForm(evento?: Evento) {
    const form = new FormGroup({
      id: new FormControl(evento?.id || ''),
      titulo: new FormControl(evento?.titulo || '', Validators.required),
      descricao: new FormControl(evento?.descricao || '', Validators.required),
      tipo: new FormControl(evento?.tipo || '', Validators.required),
      data: new FormControl(evento?.data ? new Date(evento.data).toISOString() : this.toLocalISOString(new Date()), Validators.required),
      hora: new FormControl(evento?.hora ? new Date(evento.hora).toISOString() : this.toLocalISOString(new Date()), Validators.required),
      diaSemana: new FormControl(evento?.diaSemana || ''),
      quantidadeParticipantes: new FormControl(evento?.quantidadeParticipantes || 0),
      bairro: new FormControl(evento?.bairro || '', Validators.required),
      rua: new FormControl(evento?.rua || '', Validators.required),
      latitude: new FormControl(evento?.latitude || ''),
      longitude: new FormControl(evento?.longitude || ''),
      admin: new FormControl(evento?.admin || ''),
      status_aprov: new FormControl(evento?.status_aprov || ''),
      numero: new FormControl(evento?.numero || '', Validators.required),
      complemento: new FormControl(evento?.complemento || ''),
      status: new FormControl(evento?.status || 'A', Validators.required),
      cidade: new FormControl(evento?.cidade || '', Validators.required),
      modalidade: new FormControl(evento?.modalidade || '', Validators.required),
      imagem: new FormControl(evento?.imagem || '')
    });
  
    return form;
  }

  private updateFormControls() {
    const isDisabled = !this.lAlteracao;
    Object.keys(this.eventosForm.controls).forEach(controlName => {
      const control = this.eventosForm.get(controlName);
      if (control) {
        if (isDisabled) {
          control.disable();
        } else {
          control.enable();
        }
      }
    });
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
      id: evento.id,
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

  saveEvento(tipo : String) {
    const evento: Evento = {
      ...this.eventosForm.value,
      id: this.eventoId,
      usuarios: this.participantesSelecionados
    };

    evento.hora = this.extrairHora(evento.hora);
    evento.imagem = this.imagemEvento;
    evento.status_aprov = this.inclusao ? "P" : evento.status_aprov;
    if (!evento.admin){
      evento.admin = this.usuarioLogado.sub;
    }
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


  addParticipante() {
    const usuarioLogado = this.usuarioLogado.sub;
    const participanteExistente = this.participantesSelecionados.find(p => p.usuario.id === usuarioLogado);

    if (participanteExistente) {
      let mensagem = 'O participante já está na lista.';
      
      if (participanteExistente.statusParticipante === 'R') {
        mensagem = 'A sua participação não foi autorizada pelo anfitrião do evento.';
      }
  
      this.toastController.create({
        message: mensagem,
        duration: 5000,
        keyboardClose: true,
        color: 'warning',
      }).then(t => t.present());
      return;
    }

    const evento: Evento = {
      ...this.eventosForm.value,
      id: this.eventoId,
      usuarios: this.participantesSelecionados
    };
  
    const participante: EventoUsuario = {
      evento: { id: this.eventoId } as Evento,
      usuario: usuarioLogado,
      statusParticipante: 'P',
    };
  
    this.participantesSelecionados.push(participante);
  
    const eventoUsuarios = this.participantesSelecionados.map(participante => ({
      evento: participante.evento,
      usuario: participante.usuario,
      statusParticipante: participante.statusParticipante,
    }));

    evento.eventosUsuarios = eventoUsuarios;
  
    this.eventoService.updateEventoUsuarios(evento).subscribe(
      () => {
        this.toastController.create({
          message: 'Solicitação para participar do evento enviada ao anfitrião! Aguarde aprovação.',
          duration: 3000,
          keyboardClose: true,
          color: 'success',
        }).then(t => t.present());
        this.router.navigate(['tabs/eventos']);
      },
      (erro: HttpErrorResponse) => {
        console.error(erro);
        this.toastController.create({
          message: `Não foi possível solicitar a participação. ${erro.error.message}`,
          duration: 5000,
          keyboardClose: true,
          color: 'danger',
        }).then(t => t.present());
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

  adicionarParticipante(participante: EventoUsuario) {
    const existente = this.participantesSelecionados.find(p => p.usuario === participante.usuario);
    const eventoUsuarioId = participante.id;

    console.log('teste 1');
    
    
    if (!existente) {
      participante.statusParticipante = 'A';
      console.log('teste 2');
      this.participantesSelecionados.push(participante);
      existente.statusParticipante = 'A';

      //Adiciona notificação se o usuário for aceito
      const notificacao: Notificacao = {
        descricao: 'Sua participação no evento "'+participante.evento.titulo+'" foi aprovada!',
        tipo: 'accept',
        data: new Date(),
        lido: false,
        usuario: participante.usuario
      };
      this.notificacaoService.salvar(notificacao).subscribe({
        next: (response) => console.log('Notificação salva com sucesso', response),
        error: (error) => console.error('Erro ao salvar notificação', error)
      });

      console.log(notificacao)
    }
    console.log(this.participantesSelecionados);
    this.resetSlidingItem();
  }
  
  removerParticipante(participante: EventoUsuario) {
    const participanteExistente = this.participantesSelecionados.find(p => p.usuario === participante.usuario);
  
    if (participanteExistente) {
      // Atualiza o status para 'R' se o participante já estiver na lista
      participanteExistente.statusParticipante = 'R';

      //Adiciona notificação se o usuário for reprovado
      const notificacao: Notificacao = {
        descricao: 'Sua participação no evento "'+participante.evento.titulo+'" foi recusada!',
        tipo: 'denied',
        data: new Date(),
        lido: false,
        usuario: participante.usuario
      };
      this.notificacaoService.salvar(notificacao).subscribe({
        next: (response) => console.log('Notificação salva com sucesso', response),
        error: (error) => console.error('Erro ao salvar notificação', error)
      });
      console.log(notificacao)

    } else {
      // Se o participante não existir, adiciona-o com o status 'R'
      participante.statusParticipante = 'R';
      this.participantesSelecionados.push(participante);
    }
  
    console.log(this.participantesSelecionados);
    this.resetSlidingItem();
  }
  
  resetSlidingItem() {
    document.querySelectorAll('ion-item-sliding').forEach((item: any) => {
      item.close();
      const ionItems = item.querySelectorAll('ion-item');
      ionItems.forEach((ionItem: any) => {
        ionItem.classList.remove('background-warning');
      });
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

  onCancel(){
    this.router.navigate(['tabs/eventos'])    
  }

  cancelarEvento(evento: Evento) {
    const id = evento.id || '';;
  
    this.alertController.create({
      header: 'Confirmação de cancelamento',
      message: `Deseja cancelar o evento ${evento.titulo}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.eventoService.updateStatus(id, 'C').subscribe(
              () => {
                this.toastController.create({
                  message: `Evento ${evento.titulo} cancelado com sucesso!`,
                  duration: 3000,
                  color: 'warning',
                }).then((toast) => toast.present());
                this.router.navigate(['tabs/eventos']);
              },
              (_erro: any) => {
                this.toastController.create({
                  message: `Erro ao cancelar o evento ${evento.titulo}.`,
                  duration: 3000,
                  color: 'danger',
                }).then((toast) => toast.present());
              }
            );
          }
        },
        {
          text: 'Não',
        }
      ]
    }).then((alert) => alert.present());
  }
}
