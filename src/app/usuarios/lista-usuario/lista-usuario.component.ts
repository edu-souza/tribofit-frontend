import { Component, OnInit } from "@angular/core";
import { UsuariosService } from "../services/usuarios.services";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Usuario } from "../types/usuario.interface";

@Component({
  selector: 'lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.css']
})

export class ListaUsuarioComponent implements OnInit {
  usuarioId: string | null;
  usuario!: Usuario;
  private subscriptions = new Subscription();

  constructor(private usuarioService: UsuariosService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.usuarioId = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    const id = this.usuarioId;
    if (id) {
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

  confirmarExclusao() { }
}