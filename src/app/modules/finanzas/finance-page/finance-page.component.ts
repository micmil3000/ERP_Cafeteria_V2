import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/stat-card/stat-card.component';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ExpenseFormComponent, ExpenseFormValue } from '../expense-form/expense-form.component';

interface Movement {
  readonly id: number;
  readonly tipo: 'INGRESO' | 'GASTO';
  readonly fecha: string;
  readonly concepto: string;
  readonly categoria: string;
  readonly subtotal: number;
  readonly iva: number;
  readonly total: number;
  readonly origen: 'VENTA' | 'COMPRA' | 'SALARIO' | 'MANUAL';
  readonly referencia?: string;
  readonly usuario: string;
  readonly observaciones?: string;
  readonly metodoPago?: string;
}

@Component({
  imports: [FormsModule, PageHeaderComponent, StatCardComponent, DataTableComponent, BadgeComponent, ModalComponent, ExpenseFormComponent],
  selector: 'app-finance-page',
  styleUrl: './finance-page.component.css',
  templateUrl: './finance-page.component.html',
})
export class FinancePageComponent {
  protected readonly categories = ['Ventas', 'Compras', 'Salarios', 'Servicios', 'Renta', 'Mantenimiento', 'Limpieza', 'Publicidad', 'Otros'];
  protected readonly origins = ['VENTA', 'COMPRA', 'SALARIO', 'MANUAL'];
  protected filters = { desde: '', hasta: '', tipo: '', categoria: '', origen: '' };
  protected expenseOpen = false;
  protected selectedMovement: Movement | null = null;
  protected notice = '';

  // Datos locales de ejemplo; el historial vuelve a este estado al recargar.
  protected movements: readonly Movement[] = [
    {
      id: 1,
      tipo: 'INGRESO',
      fecha: '2026-09-01',
      concepto: 'Venta #1051',
      categoria: 'Ventas',
      subtotal: 1850,
      iva: 296,
      total: 2146,
      origen: 'VENTA',
      referencia: '#1051',
      usuario: 'Ana Torres'
    },
    {
      id: 2,
      tipo: 'INGRESO',
      fecha: '2026-09-02',
      concepto: 'Venta #1052',
      categoria: 'Ventas',
      subtotal: 2725,
      iva: 436,
      total: 3161,
      origen: 'VENTA',
      referencia: '#1052',
      usuario: 'Ana Torres'
    },
    {
      id: 3,
      tipo: 'INGRESO',
      fecha: '2026-09-04',
      concepto: 'Venta #1053',
      categoria: 'Ventas',
      subtotal: 3420,
      iva: 547.20,
      total: 3967.20,
      origen: 'VENTA',
      referencia: '#1053',
      usuario: 'Ana Torres'
    },
    {
      id: 4,
      tipo: 'INGRESO',
      fecha: '2026-09-06',
      concepto: 'Venta #1054',
      categoria: 'Ventas',
      subtotal: 2180,
      iva: 348.80,
      total: 2528.80,
      origen: 'VENTA',
      referencia: '#1054',
      usuario: 'Ana Torres'
    },
    {
      id: 5,
      tipo: 'GASTO',
      fecha: '2026-09-01',
      concepto: 'Compra de productos para cafetería',
      categoria: 'Compras',
      subtotal: 1450,
      iva: 232,
      total: 1682,
      origen: 'COMPRA',
      referencia: 'OC-028',
      usuario: 'Ana Torres'
    },
    {
      id: 6,
      tipo: 'GASTO',
      fecha: '2026-09-03',
      concepto: 'Pago de salarios',
      categoria: 'Salarios',
      subtotal: 2800,
      iva: 0,
      total: 2800,
      origen: 'SALARIO',
      referencia: 'NOM-012',
      usuario: 'Ana Torres'
    },
    {
      id: 7,
      tipo: 'GASTO',
      fecha: '2026-09-04',
      concepto: 'Servicio de internet',
      categoria: 'Servicios',
      subtotal: 520,
      iva: 83.20,
      total: 603.20,
      origen: 'MANUAL',
      usuario: 'Ana Torres',
      metodoPago: 'Transferencia',
      observaciones: 'Pago mensual del servicio de internet del establecimiento.'
    },
    {
      id: 8,
      tipo: 'GASTO',
      fecha: '2026-09-05',
      concepto: 'Mantenimiento de molino de café',
      categoria: 'Mantenimiento',
      subtotal: 750,
      iva: 120,
      total: 870,
      origen: 'MANUAL',
      usuario: 'Ana Torres',
      metodoPago: 'Tarjeta',
      observaciones: 'Mantenimiento preventivo y limpieza del molino principal.'
    },
    {
      id: 9,
      tipo: 'GASTO',
      fecha: '2026-09-06',
      concepto: 'Compra de artículos de limpieza',
      categoria: 'Limpieza',
      subtotal: 380,
      iva: 60.80,
      total: 440.80,
      origen: 'MANUAL',
      usuario: 'Ana Torres',
      metodoPago: 'Efectivo',
      observaciones: 'Productos de limpieza para el área de atención y preparación.'
    }
  ];

  protected get invalidDates(): boolean {
    return !!(this.filters.desde && this.filters.hasta && this.filters.desde > this.filters.hasta);
  }

  protected get filteredMovements(): readonly Movement[] {
    if (this.invalidDates) return [];
    const f = this.filters;
    return this.movements.filter((m) =>
      (!f.desde || m.fecha >= f.desde) && (!f.hasta || m.fecha <= f.hasta) &&
      (!f.tipo || m.tipo === f.tipo) && (!f.categoria || m.categoria === f.categoria) &&
      (!f.origen || m.origen === f.origen)
    ).sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  }

  private totalFor(type: Movement['tipo']): number {
    return this.filteredMovements.filter((m) => m.tipo === type)
      .reduce((sum, m) => sum + Math.round(m.total * 100), 0) / 100;
  }

  protected get income(): number { return this.totalFor('INGRESO'); }
  protected get expenses(): number { return this.totalFor('GASTO'); }
  protected get profit(): number { return (Math.round(this.income * 100) - Math.round(this.expenses * 100)) / 100; }

  protected get summary() {
    return [
      { label: 'Ingresos', value: this.income, detail: 'Ventas confirmadas del periodo', tone: 'sage', icon: 'M12 19V5 M6 11l6-6 6 6' },
      { label: 'Gastos', value: this.expenses, detail: 'Compras, salarios y otros gastos', tone: 'terracotta', icon: 'M12 5v14 M6 13l6 6 6-6' },
      { label: 'Ganancia', value: this.profit, detail: 'Resultado del periodo', tone: 'cinnamon', icon: 'M3 3v18h18 M7 15l4-5 4 2 6-7' },
    ];
  }

  protected get comparison() {
    const max = Math.max(this.income, this.expenses, 1);
    return [
      { label: 'Ingresos', total: this.income, percentage: this.income / max * 100, tone: 'sage' },
      { label: 'Gastos', total: this.expenses, percentage: this.expenses / max * 100, tone: 'terracotta' },
    ];
  }

  protected get categoryExpenses() {
    const groups = this.categories.map((label) => ({
      label,
      total: this.filteredMovements.filter((m) => m.tipo === 'GASTO' && m.categoria === label)
        .reduce((sum, m) => sum + Math.round(m.total * 100), 0) / 100,
    })).filter((group) => group.total > 0);
    const max = Math.max(...groups.map((group) => group.total), 1);
    return groups.map((group, index) => ({ ...group, percentage: group.total / max * 100, tone: ['sage', 'cinnamon', 'terracotta'][index % 3] }));
  }

  protected money(value: number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  protected date(value: string): string {
    return value.split('-').reverse().join('/');
  }

  protected clearFilters(): void {
    this.filters = { desde: '', hasta: '', tipo: '', categoria: '', origen: '' };
  }

  protected saveExpense(value: ExpenseFormValue): void {
    const cents = Math.round(value.subtotal * 100);
    const ivaCents = Math.round(cents * 0.16);
    const movement: Movement = {
      ...value,
      id: Math.max(...this.movements.map((m) => m.id), 0) + 1,
      tipo: 'GASTO',
      origen: 'MANUAL',
      subtotal: cents / 100,
      iva: ivaCents / 100,
      total: (cents + ivaCents) / 100,
      usuario: 'Ana Torres',
    };
    this.movements = [movement, ...this.movements];
    this.expenseOpen = false;
    this.notice = this.filteredMovements.some((m) => m.id === movement.id)
      ? 'Gasto registrado correctamente.'
      : 'Gasto registrado. No aparece en los resultados porque no coincide con los filtros actuales.';
  }
}
