import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/stat-card/stat-card.component';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ExpenseFormComponent, ExpenseFormValue } from '../expense-form/expense-form.component';

import { FiltrosFinancieros, MovimientoFinanciero } from '../../../models/movimiento-financiero.model';

import { FinanzaService } from '../../../services/finanza.service';

type MovimientoVista = MovimientoFinanciero & {
  fecha : string;
  referencia : string | null;
};

@Component({
  imports: [FormsModule, PageHeaderComponent, StatCardComponent, DataTableComponent, BadgeComponent, ModalComponent, ExpenseFormComponent],
  selector: 'app-finance-page',
  styleUrl: './finance-page.component.css',
  templateUrl: './finance-page.component.html'
})

export class FinancePageComponent implements OnInit {

  //Variables para controlar los filtros y modales
  protected readonly categories = ['Ventas', 'Compras', 'Salarios', 'Servicios', 'Renta', 'Mantenimiento', 'Limpieza', 'Publicidad', 'Otros'];
  protected readonly origins = ['VENTA', 'COMPRA', 'SALARIO', 'MANUAL'];
  protected filters : FiltrosFinancieros = { desde: '', hasta: '', tipo: '', categoria: '', origen: '' };
  protected expenseOpen = false;
  protected selectedMovement : MovimientoVista | null = null;
  protected notice = '';
  protected filteredMovements : MovimientoVista[] = [];
  protected income = 0;
  protected expenses = 0;
  protected categoryExpenses : { label : string; total : number; percentage : number; tone : string }[] = [];

  constructor(
    private finanzaService : FinanzaService,
    private cdr : ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  protected get invalidDates(): boolean {
    return !!(this.filters.desde && this.filters.hasta && this.filters.desde > this.filters.hasta);
  }

  protected get profit(): number {
    return this.income - this.expenses;
  }

  protected get summary() {
    return [
      { label: 'Ingresos', value: this.income, detail: 'Ingresos del periodo', tone: 'sage', icon: 'M12 19V5 M6 11l6-6 6 6' },
      { label: 'Gastos', value: this.expenses, detail: 'Gastos del periodo', tone: 'terracotta', icon: 'M12 5v14 M6 13l6 6 6-6' },
      { label: 'Ganancia', value: this.profit, detail: 'Resultado del periodo', tone: 'cinnamon', icon: 'M3 3v18h18 M7 15l4-5 4 2 6-7' }
    ];
  }

  protected get comparison() {
    const maximo = Math.max(this.income, this.expenses, 1);

    return [
      { label: 'Ingresos', total: this.income, percentage: this.income / maximo * 100, tone: 'sage' },
      { label: 'Gastos', total: this.expenses, percentage: this.expenses / maximo * 100, tone: 'terracotta' }
    ];
  }

  //Carga movimientos, resumen y gráficas con los mismos filtros
  protected loadData(): void {

    if(this.invalidDates) {
      this.filteredMovements = [];
      return;
    }

    this.finanzaService.obtenerMovimientos(this.filters).subscribe({
      next: (movimientos) => {
        this.filteredMovements = movimientos.map((movimiento) => ({
          ...movimiento,
          fecha: movimiento.fechaHora,
          referencia: movimiento.referenciaOrigen
        }));
        this.cdr.markForCheck();
      },
      error: () => this.mostrarError()
    });

    this.finanzaService.obtenerResumen(this.filters).subscribe({
      next: (resumen) => {
        this.income = Number(resumen.ingresos);
        this.expenses = Number(resumen.gastos);
        this.cdr.markForCheck();
      },
      error: () => this.mostrarError()
    });

    this.finanzaService.obtenerGastosCategoria(this.filters).subscribe({
      next: (gastos) => {
        const maximo = Math.max(...gastos.map((gasto) => Number(gasto.total)), 1);
        const tonos = ['sage', 'cinnamon', 'terracotta'];

        this.categoryExpenses = gastos.map((gasto, indice) => ({
          label: gasto.categoria,
          total: Number(gasto.total),
          percentage: Number(gasto.total) / maximo * 100,
          tone: tonos[indice % tonos.length]
        }));
        this.cdr.markForCheck();
      },
      error: () => this.mostrarError()
    });

  }

  private mostrarError(): void {
    this.notice = 'No fue posible consultar la información financiera.';
    this.cdr.markForCheck();
  }

  protected money(value : number): string {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
  }

  protected date(value : string): string {
    return new Intl.DateTimeFormat('es-MX', { timeZone: 'America/Mexico_City' }).format(new Date(value));
  }

  protected clearFilters(): void {
    this.filters = { desde: '', hasta: '', tipo: '', categoria: '', origen: '' };
    this.loadData();
  }

  //Registra un gasto manual mediante el backend
  protected saveExpense(gasto : ExpenseFormValue): void {

    this.finanzaService.registrarGasto({
      usuarioId: 1,
      fechaHora: gasto.fecha + ' 12:00:00',
      ...gasto
    }).subscribe({
      next: () => {
        this.expenseOpen = false;
        this.notice = 'Gasto registrado correctamente.';
        this.loadData();
      },
      error: () => {
        this.notice = 'No fue posible registrar el gasto.';
        this.cdr.markForCheck();
      }
    });

  }

}
