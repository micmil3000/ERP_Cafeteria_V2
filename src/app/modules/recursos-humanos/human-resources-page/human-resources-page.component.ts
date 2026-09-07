import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { TabsComponent } from '../../../shared/tabs/tabs.component';
import { BadgeComponent } from '../../../shared/badge/badge.component';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { ScheduleFormComponent } from '../schedule-form/schedule-form.component';
import { SalaryPaymentFormComponent } from '../salary-payment-form/salary-payment-form.component';

export interface Employee {
  readonly id: number;
  readonly nombre: string;
  readonly apellidos: string;
  readonly telefono: string;
  readonly correo: string;
  readonly fechaContratacion: string;
  readonly salario: number;
  readonly estado: 'ACTIVO' | 'INACTIVO';
}
export interface WorkDay {
  readonly dia: number;
  readonly descanso: boolean;
  readonly entrada: string;
  readonly salida: string;
}
interface Attendance {
  readonly id: number;
  readonly empleadoId: number;
  readonly fecha: string;
  readonly entrada: string;
  readonly salida: string;
  readonly estado: 'PRESENTE' | 'RETARDO' | 'FALTA';
}
interface SalaryPayment {
  readonly id: number;
  readonly empleadoId: number;
  readonly trabajador: string;
  readonly periodo: string;
  readonly fecha: string;
  readonly monto: number;
  readonly responsable: string;
}

@Component({
  imports: [PageHeaderComponent, TabsComponent, BadgeComponent, DataTableComponent, ModalComponent, ConfirmDialogComponent,
    EmployeeFormComponent, ScheduleFormComponent, SalaryPaymentFormComponent],
  selector: 'app-human-resources-page',
  styleUrl: './human-resources-page.component.css',
  templateUrl: './human-resources-page.component.html',
})
export class HumanResourcesPageComponent {
  protected readonly currentRole: 'GERENTE' | 'TRABAJADOR' = 'TRABAJADOR'; // Cambiar a 'GERENTE' para ver todas las funcionalidades
  protected activeTab = 'people';
  protected notice = '';
  protected formOpen = false;
  protected editingEmployee: Employee | null = null;
  protected pendingDeactivation: Employee | null = null;
  protected scheduleEmployee: Employee | null = null;
  protected paymentOpen = false;
  protected selectedPayment: SalaryPayment | null = null;
  protected readonly dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  protected employees: readonly Employee[] = [
    { id: 1, nombre: 'Ana', apellidos: 'Torres', telefono: '3315872401', correo: 'gerente@savia.com', fechaContratacion: '2024-02-12', salario: 18500, estado: 'ACTIVO' },
    { id: 2, nombre: 'Carlos', apellidos: 'Ruiz', telefono: '3326741935', correo: 'trabajador@savia.com', fechaContratacion: '2025-01-20', salario: 9800, estado: 'ACTIVO' },
    { id: 3, nombre: 'Mariana', apellidos: 'Sánchez', telefono: '3337614280', correo: 'mariana@savia.com', fechaContratacion: '2025-03-18', salario: 10200, estado: 'ACTIVO' },
    { id: 4, nombre: 'Jorge', apellidos: 'Ramírez', telefono: '3348523174', correo: 'jorge@savia.com', fechaContratacion: '2025-05-09', salario: 9400, estado: 'ACTIVO' },
    { id: 5, nombre: 'Valeria', apellidos: 'Castillo', telefono: '3359432068', correo: 'valeria@savia.com', fechaContratacion: '2025-07-14', salario: 9900, estado: 'ACTIVO' },
    { id: 6, nombre: 'Miguel', apellidos: 'Navarro', telefono: '3361387952', correo: 'miguel@savia.com', fechaContratacion: '2024-11-03', salario: 9100, estado: 'INACTIVO' },
  ];

  protected schedules: Record<number, readonly WorkDay[]> = Object.fromEntries(this.employees.map((e) => [e.id,
    [1, 2, 3, 4, 5, 6, 0].map((dia) => ({ dia, descanso: dia === 0, entrada: '08:00', salida: '16:00' })),
  ]));

  protected attendance: readonly Attendance[] = [
    { id: 1, empleadoId: 1, fecha: '2026-09-02', entrada: '07:56', salida: '16:03', estado: 'PRESENTE' },
    { id: 2, empleadoId: 2, fecha: '2026-09-02', entrada: '08:11', salida: '16:01', estado: 'RETARDO' },
    { id: 3, empleadoId: 3, fecha: '2026-09-02', entrada: '07:59', salida: '16:04', estado: 'PRESENTE' },
    { id: 4, empleadoId: 4, fecha: '2026-09-03', entrada: '', salida: '', estado: 'FALTA' },
    { id: 5, empleadoId: 5, fecha: '2026-09-03', entrada: '08:03', salida: '16:00', estado: 'PRESENTE' },
    { id: 6, empleadoId: 2, fecha: '2026-09-04', entrada: '07:54', salida: '16:06', estado: 'PRESENTE' },
    { id: 7, empleadoId: 6, fecha: '2026-08-25', entrada: '08:00', salida: '16:00', estado: 'PRESENTE' },
  ];

  protected payments: readonly SalaryPayment[] = [
    { id: 1, empleadoId: 1, trabajador: 'Ana Torres', periodo: 'Agosto 2026', fecha: '2026-08-31', monto: 18500, responsable: 'Ana Torres' },
    { id: 2, empleadoId: 2, trabajador: 'Carlos Ruiz', periodo: 'Agosto 2026', fecha: '2026-08-31', monto: 9800, responsable: 'Ana Torres' },
    { id: 3, empleadoId: 3, trabajador: 'Mariana Sánchez', periodo: 'Agosto 2026', fecha: '2026-08-31', monto: 10200, responsable: 'Ana Torres' },
    { id: 4, empleadoId: 4, trabajador: 'Jorge Ramírez', periodo: 'Agosto 2026', fecha: '2026-08-31', monto: 9400, responsable: 'Ana Torres' },
    { id: 5, empleadoId: 5, trabajador: 'Valeria Castillo', periodo: 'Agosto 2026', fecha: '2026-08-31', monto: 9900, responsable: 'Ana Torres' },
    { id: 6, empleadoId: 6, trabajador: 'Miguel Navarro', periodo: 'Julio 2026', fecha: '2026-07-31', monto: 9100, responsable: 'Ana Torres' },
  ];

  protected get currentEmployee(): Employee { return this.employees.find((e) => e.id === (this.currentRole === 'GERENTE' ? 1 : 2))!; }
  protected get tabs() {
    return this.currentRole === 'GERENTE'
      ? [{ id: 'people', label: 'Trabajadores' }, { id: 'attendance', label: 'Asistencia' }, { id: 'payments', label: 'Pagos' }]
      : [{ id: 'people', label: 'Mi información' }, { id: 'attendance', label: 'Mi asistencia' }, { id: 'payments', label: 'Mis pagos' }];
  }
  protected get activeEmployees() { return this.employees.filter((e) => e.estado === 'ACTIVO'); }
  protected get visibleAttendance() {
    return this.attendance.filter((a) => this.currentRole === 'GERENTE' || a.empleadoId === this.currentEmployee.id)
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
  }
  protected get visiblePayments() { return this.payments.filter((p) => this.currentRole === 'GERENTE' || p.empleadoId === this.currentEmployee.id); }
  protected get todayAttendance() { return this.attendance.find((a) => a.empleadoId === this.currentEmployee.id && a.fecha === this.clock().fecha); }
  protected name(employee: Employee): string { return employee.nombre + ' ' + employee.apellidos; }
  protected employeeName(id: number): string { const e = this.employees.find((e) => e.id === id); return e ? this.name(e) : 'Trabajador'; }
  protected money(value: number): string { return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value); }
  protected date(value: string): string { return value.split('-').reverse().join('/'); }
  protected scheduleFor(id: number): readonly WorkDay[] { return this.schedules[id] ?? []; }
  private clock() {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const part = (type: string) => parts.find((p) => p.type === type)!.value;
    return { fecha: part('year') + '-' + part('month') + '-' + part('day'), hora: part('hour') + ':' + part('minute') };
  }
  protected registerEntry(): void {
    const current = this.currentEmployee;
    if (current.estado !== 'ACTIVO') return;
    const now = this.clock();
    const existing = this.attendance.find((a) => a.empleadoId === current.id && a.fecha === now.fecha);
    if (existing?.entrada) { this.notice = 'Ya registraste tu entrada de hoy.'; return; }
    const dia = new Date(now.fecha + 'T12:00:00Z').getUTCDay();
    const schedule = this.scheduleFor(current.id).find((d) => d.dia === dia);
    const record: Attendance = {
      id: existing?.id ?? Math.max(0, ...this.attendance.map((a) => a.id)) + 1,
      empleadoId: current.id, fecha: now.fecha, entrada: now.hora, salida: '',
      estado: schedule && !schedule.descanso && now.hora > schedule.entrada ? 'RETARDO' : 'PRESENTE',
    };
    this.attendance = existing ? this.attendance.map((a) => a.id === existing.id ? record : a) : [record, ...this.attendance];
    this.notice = 'Entrada registrada a las ' + now.hora + '.';
  }
  protected registerExit(): void {
    const now = this.clock();
    const entry = this.attendance.find((a) => a.empleadoId === this.currentEmployee.id && a.fecha === now.fecha);
    if (!entry?.entrada) { this.notice = 'Registra tu entrada antes de registrar la salida.'; return; }
    if (entry.salida) { this.notice = 'Ya registraste tu salida de hoy.'; return; }
    this.attendance = this.attendance.map((a) => a.id === entry.id ? { ...a, salida: now.hora } : a);
    this.notice = 'Salida registrada a las ' + now.hora + '.';
  }
  protected openEmployee(employee: Employee | null = null): void {
    if (this.currentRole !== 'GERENTE') return;
    this.editingEmployee = employee;
    this.formOpen = true;
  }
  protected saveEmployee(value: Omit<Employee, 'id' | 'estado'>): void {
    if (this.currentRole !== 'GERENTE' || !this.formOpen) return;
    if (this.editingEmployee) this.employees = this.employees.map((e) => e.id === this.editingEmployee!.id ? { ...e, ...value } : e);
    else {
      const id = Math.max(0, ...this.employees.map((e) => e.id)) + 1;
      this.employees = [...this.employees, { ...value, id, estado: 'ACTIVO' }];
      this.schedules = { ...this.schedules, [id]: [1, 2, 3, 4, 5, 6, 0].map((dia) => ({ dia, descanso: true, entrada: '', salida: '' })) };
    }
    this.formOpen = false;
    this.notice = 'Trabajador guardado correctamente.';
  }
  protected deactivate(): void {
    if (this.currentRole !== 'GERENTE' || !this.pendingDeactivation) return;
    this.employees = this.employees.map((e) => e.id === this.pendingDeactivation!.id ? { ...e, estado: 'INACTIVO' } : e);
    this.pendingDeactivation = null;
    this.notice = 'Trabajador desactivado. Su información e historial se conservan.';
  }
  protected saveSchedule(days: readonly WorkDay[]): void {
    if (this.currentRole !== 'GERENTE' || !this.scheduleEmployee) return;
    this.schedules = { ...this.schedules, [this.scheduleEmployee.id]: days.map((day) => ({ ...day })) };
    this.scheduleEmployee = null;
    this.notice = 'Horario actualizado.';
  }
  protected savePayment(value: { empleadoId: number; periodo: string }): void {
    if (this.currentRole !== 'GERENTE' || !this.paymentOpen || !value.periodo.trim()) return;
    const employee = this.activeEmployees.find((e) => e.id === value.empleadoId);
    if (!employee) return;
    this.payments = [{
      id: Math.max(0, ...this.payments.map((p) => p.id)) + 1, empleadoId: employee.id, trabajador: this.name(employee),
      periodo: value.periodo.trim(), fecha: this.clock().fecha, monto: employee.salario, responsable: 'Ana Torres',
    }, ...this.payments];
    this.paymentOpen = false;
    this.notice = 'Pago de salario registrado correctamente.';
  }
  protected openPaymentDetail(payment: SalaryPayment): void {
    this.selectedPayment = this.visiblePayments.find((p) => p.id === payment.id) ?? null;
  }
}
