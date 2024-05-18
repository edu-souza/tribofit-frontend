import { Component, OnInit } from "@angular/core";
import { UsuariosService } from "../services/usuarios.services";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Usuario } from "../types/usuario.interface";

@Component({
  selector: 'lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.css']
})

export class ListaUsuarioComponent implements OnInit {
  usuarioId: number | null;
  usuario!: Usuario;
  private subscriptions = new Subscription();

  constructor(private usuarioService: UsuariosService,
    private router: Router
  ) {
    this.usuarioId = 1;
  }

  ngOnInit(): void {
    const id = this.usuarioId;
    if (id) {
      //needs parse int ?
      this.subscriptions.add(this.usuarioService.getUsuario(id).subscribe(
        (response) => {
          console.log(response);
          this.usuario = response;
        },
        (erro) =>
          console.log(erro))
      )
    }
  }
}