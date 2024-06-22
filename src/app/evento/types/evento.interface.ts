import { IonDatetime } from "@ionic/angular";

export interface Evento {
  id?: string | null;
  titulo: string;
  descricao: string;
  tipo: string;
  data: Date;
  senha: string;
  hora: Date;
  diasemana: String;
  quantidadeParticipantes: number;
  bairro: String;
  rua: String;
  numero: String;
  complemento: String;
  latitude: String
  longitude: String
  status: String
  cidade: String
}