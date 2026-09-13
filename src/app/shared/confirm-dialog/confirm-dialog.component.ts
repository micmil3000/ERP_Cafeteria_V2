import { Component, EventEmitter, input, Output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  imports: [ModalComponent],
  selector: 'app-confirm-dialog',
  styleUrl: './confirm-dialog.component.css',
  templateUrl: './confirm-dialog.component.html',
})

//Componente reutilizable para mostrar un modal de confirmación de acciones
export class ConfirmDialogComponent { 
  //Datos que recibe para mostrar el modal de confirmación dinámicamente
  open = input.required<boolean>();
  title = input.required<string>();
  message = input.required<string>();
  confirmText = input.required<string>();
  variant = input<'primary' | 'danger'>('primary');
  
  //Eventos que emite si se confirma o cancela la acción
  @Output() readonly confirm = new EventEmitter<void>();
  @Output() readonly cancel = new EventEmitter<void>();
}
