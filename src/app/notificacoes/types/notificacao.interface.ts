import { Usuario } from "src/app/usuarios/types/usuario.interface";

export interface Notificacao {
  id?: string;
  descricao: string;
  tipo: string;
  data: Date;
  lido: Boolean;
  usuario: Usuario;
}