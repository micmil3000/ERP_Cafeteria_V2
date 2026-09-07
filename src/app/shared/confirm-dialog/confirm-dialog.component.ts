import { Component, EventEmitter, input, Output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  imports: [ModalComponent],
  selector: 'app-confirm-dialog',
  styleUrl: './confirm-dialog.component.css',
  templateUrl: './confirm-dialog.component.html',
})

export class ConfirmDialogComponent {
  open = input.required<boolean>();
  title = input.required<string>();
  message = input.required<string>();
  confirmText = input.required<string>();
  variant = input<'primary' | 'danger'>('primary');
  
  @Output() readonly confirm = new EventEmitter<void>();
  @Output() readonly cancel = new EventEmitter<void>();
}
