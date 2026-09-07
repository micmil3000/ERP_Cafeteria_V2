import { afterNextRender, Component, ElementRef, EventEmitter, input, OnChanges, Output, ViewChild } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-modal',
  styleUrl: './modal.component.css',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnChanges {
  open = input.required<boolean>();
  title = input<string>('');

  @Output() readonly close = new EventEmitter<void>();
  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;
  private ready = false;

  constructor() {
    afterNextRender(() => {
      this.ready = true;
      this.syncOpen();
    });
  }

  ngOnChanges(): void {
    this.syncOpen();
  }

  protected requestClose(event?: Event): void {
    event?.preventDefault();
    this.close.emit();
  }

  private syncOpen(): void {
    if (!this.ready) return;
    const dialog = this.dialog.nativeElement;
    if (this.open() && !dialog.open) dialog.showModal();
    if (!this.open() && dialog.open) dialog.close();
  }
}
