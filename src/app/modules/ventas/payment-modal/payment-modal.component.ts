import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../shared/modal/modal.component';

@Component({
  imports: [FormsModule, ModalComponent],
  selector: 'app-payment-modal',
  styleUrl: './payment-modal.component.css',
  templateUrl: './payment-modal.component.html',
})
export class PaymentModalComponent {
  readonly subtotal = input.required<number>();
  readonly iva = input.required<number>();
  readonly total = input.required<number>();
  readonly error = input('');
  readonly confirm = output<{ approved: boolean; method: string }>();
  readonly close = output<void>();
  protected method = 'Efectivo';
  protected result = 'approved';
  protected rejected = false;

  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  protected submit(): void {
    this.rejected = this.result === 'rejected';
    this.confirm.emit({ approved: !this.rejected, method: this.method });
  }
}
