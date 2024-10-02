import { Cidade } from "src/app/core/cidade.interface";

export interface Usuario {
  id?: string | null;
  nome: string;
  email: string;
  cidade: Cidade;
  dataNascimento: string;
  senha: string;
  acesso: string;
  imagem?: string; 
}