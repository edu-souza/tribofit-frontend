import { Cidade } from "src/app/core/cidade.interface";
import { Modalidade } from "src/app/modalidades/types/modalidade.interface";
import { Usuario } from "src/app/usuarios/types/usuario.interface";

export interface Evento {
  id?: string | null;
  titulo: string;
  descricao: string;
  tipo: string;
  data: Date;
  hora: string;
  diaSemana: String;
  quantidadeParticipantes: number;
  bairro: string;
  rua: string;
  numero: string;
  complemento: string;
  latitude : string;
  longitude : string;
  admin : string;
  imagem : string;
  status_aprov: string;
  status: string;
  cidade: Cidade;
  modalidade: Modalidade;
  usuarios : Usuario[];
}