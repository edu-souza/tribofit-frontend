import { Evento } from "./evento.interface";
import { Usuario } from "src/app/usuarios/types/usuario.interface";

export interface EventoUsuario {
  id?: string | null;
  statusParticipante: string;
  evento: Evento;
  usuario: Usuario;
  imagem?: string | null;
}