import { Cidade } from "src/app/core/cidade.interface";

export interface Usuario {
  id?: string | null;
  nome: string;
  email: string;
  dataNascimento: Date;
  senha: string;
  cidade: Cidade; 
  imagem: string;
  acesso?: string;
  eventos?: string[];
}