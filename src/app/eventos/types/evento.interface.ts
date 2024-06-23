import { IonDatetime } from "@ionic/angular";
import { Cidade } from "src/app/core/cidade.interface";

export interface Evento {
  id?: string | null;
  titulo: string;
  descricao: string;
  tipo: string;
  data: Date;
  hora: string;
  diasemana: String;
  quantidadeParticipantes: number;
  bairro: String;
  rua: String;
  numero: String;
  complemento: String;
  status: String
  cidade: Cidade
}