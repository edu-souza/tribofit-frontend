import { Cidade } from "src/app/core/cidade.interface";

export interface Usuario {
  id?: string | null;
  nome: string;
  email: string;
  dataNascimento: Date;
  senha: string;
  cidade: Cidade; 
  eventos: string[];
}