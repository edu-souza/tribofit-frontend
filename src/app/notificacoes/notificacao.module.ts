import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from '@angular/common';
import { NotificacaoComponent } from "./notificacao.component";
import { CoreModule } from "../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    DatePipe,
    FormsModule,
    CoreModule
    ],
  declarations: [NotificacaoComponent],
  exports: []
})

export class NotificacaoModule { }