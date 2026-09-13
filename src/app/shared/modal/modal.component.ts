import { afterNextRender, Component, ElementRef, EventEmitter, input, OnChanges, Output, ViewChild } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-modal',
  styleUrl: './modal.component.css',
  templateUrl: './modal.component.html',
})

//Componente reutilizable para mostrar un modal
export class ModalComponent implements OnChanges {
  // Propiedades de entrada para controlar la visibilidad y el título del modal
  open = input.required<boolean>();
  title = input<string>('');

  // Evento de salida para notificar cuando se cierra el modal
  @Output() readonly close = new EventEmitter<void>();

  // Referencia al elemento dialog del modal
  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;
  private ready = false;

  // Constructor que se ejecuta después de que el componente se ha renderizado
  constructor() {
    afterNextRender(() => {
      this.ready = true;
      this.syncOpen();
    });
  }

  // Método que se ejecuta cuando cambian las propiedades de entrada
  ngOnChanges(): void {
    this.syncOpen();
  }

  // Método protegido para solicitar el cierre del modal y emitir el evento de cierre
  protected requestClose(event?: Event): void {
    event?.preventDefault();
    this.close.emit();
  }

  // Método privado para sincronizar el estado de apertura del modal con el elemento dialog
  private syncOpen(): void {
    if (!this.ready) return;
    const dialog = this.dialog.nativeElement;
    if (this.open() && !dialog.open) dialog.showModal();
    if (!this.open() && dialog.open) dialog.close();
  }
}
