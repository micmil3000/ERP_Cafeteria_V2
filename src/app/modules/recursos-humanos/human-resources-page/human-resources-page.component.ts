import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';

import { TabsComponent } from '../../../shared/tabs/tabs.component';

import { BadgeComponent } from '../../../shared/badge/badge.component';

import { DataTableComponent } from '../../../shared/data-table/data-table.component';

import { ModalComponent } from '../../../shared/modal/modal.component';

import { Funcionario } from '../../../models/funcionario.model';

import { Asistencia } from '../../../models/asistencia.model';

import { Horario } from '../../../models/horario.model';

import { PagoSalario } from '../../../models/pago-salario.model';

import { FuncionarioService } from '../../../services/funcionario.service';

//Tipos conservados para componentes antiguos que ya no utiliza esta pantalla
export type Employee = Funcionario;

export interface WorkDay {
  readonly dia : number;
  readonly descanso : boolean;
  readonly entrada : string;
  readonly salida : string;
}

@Component({
  imports: [PageHeaderComponent, TabsComponent, BadgeComponent, DataTableComponent, ModalComponent],
  selector: 'app-human-resources-page',
  styleUrl: './human-resources-page.component.css',
  templateUrl: './human-resources-page.component.html',
})

export class HumanResourcesPageComponent implements OnInit {

  //Variable para probar la vista de GERENTE o TRABAJADOR
  protected readonly currentRole : 'GERENTE' | 'TRABAJADOR' = 'TRABAJADOR';

  //ID utilizado para probar la vista del trabajador
  private readonly currentFuncionarioId = 2;

  //Variables para controlar pestañas, avisos y modales de consulta
  protected activeTab = 'people';
  protected notice = '';
  protected funcionarios : Funcionario[] = [];
  protected currentFuncionario : Funcionario | null = null;
  protected asistencias : Asistencia[] = [];
  protected pagos : PagoSalario[] = [];
  protected horario : Horario[] = [];
  protected horarioFuncionario : Funcionario | null = null;
  protected selectedPayment : PagoSalario | null = null;

  constructor(
    private funcionarioService : FuncionarioService,
    private cdr : ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    //Cambia la carga de información dependiendo del rol seleccionado
    if(this.currentRole === 'GERENTE') {
      this.cargarInformacionGerente();
    } else {
      this.cargarInformacionTrabajador();
    }

  }

  //Obtiene las pestañas correspondientes al rol actual
  protected get tabs() {

    return this.currentRole === 'GERENTE'
      ? [
          { id: 'people', label: 'Trabajadores' },
          { id: 'attendance', label: 'Asistencia' },
          { id: 'payments', label: 'Pagos' }
        ]
      : [
          { id: 'people', label: 'Mi información' },
          { id: 'attendance', label: 'Mi asistencia' },
          { id: 'payments', label: 'Mis pagos' }
        ];

  }

  //Carga la información necesaria para la vista del gerente
  private cargarInformacionGerente(): void {
    this.cargarFuncionarios();
    this.cargarAsistencias();
    this.cargarPagos();
  }

  //Carga únicamente la información del trabajador actual
  private cargarInformacionTrabajador(): void {
    this.cargarFuncionario();
    this.cargarHorarioTrabajador();
    this.cargarAsistenciasTrabajador();
    this.cargarPagosTrabajador();
  }

  //Carga los funcionarios desde el backend
  private cargarFuncionarios(): void {

    this.funcionarioService.obtenerFuncionarios().subscribe({
      next: (funcionarios) => {
        this.funcionarios = funcionarios;
        this.currentFuncionario = funcionarios[0] ?? null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar funcionarios: ', error);
        this.mostrarError('los funcionarios');
      }
    });

  }

  //Carga los datos del trabajador desde el backend
  private cargarFuncionario(): void {

    this.funcionarioService.obtenerFuncionarioPorId(this.currentFuncionarioId).subscribe({
      next: (funcionario) => {
        this.currentFuncionario = funcionario;
        this.funcionarios = [funcionario];
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar funcionario: ', error);
        this.mostrarError('la información del trabajador');
      }
    });

  }

  //Carga las asistencias para la vista del gerente
  private cargarAsistencias(): void {

    this.funcionarioService.obtenerAsistencias().subscribe({
      next: (asistencias) => {
        this.asistencias = asistencias;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar asistencias: ', error);
        this.mostrarError('las asistencias');
      }
    });

  }

  //Carga las asistencias del trabajador
  private cargarAsistenciasTrabajador(): void {

    this.funcionarioService.obtenerAsistenciasPorFuncionario(this.currentFuncionarioId).subscribe({
      next: (asistencias) => {
        this.asistencias = asistencias;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar asistencias del trabajador: ', error);
        this.mostrarError('las asistencias');
      }
    });

  }

  //Carga los pagos para la vista del gerente
  private cargarPagos(): void {

    this.funcionarioService.obtenerPagos().subscribe({
      next: (pagos) => {
        this.pagos = pagos;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar pagos: ', error);
        this.mostrarError('los pagos');
      }
    });

  }

  //Carga los pagos del trabajador
  private cargarPagosTrabajador(): void {

    this.funcionarioService.obtenerPagosPorFuncionario(this.currentFuncionarioId).subscribe({
      next: (pagos) => {
        this.pagos = pagos;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar pagos del trabajador: ', error);
        this.mostrarError('los pagos');
      }
    });

  }

  //Carga el horario del trabajador
  private cargarHorarioTrabajador(): void {

    this.funcionarioService.obtenerHorario(this.currentFuncionarioId).subscribe({
      next: (horario) => {
        this.horario = horario;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar horario del trabajador: ', error);
        this.mostrarError('el horario');
      }
    });

  }

  //Consulta el horario del funcionario
  protected consultarHorario(funcionario : Funcionario): void {

    this.funcionarioService.obtenerHorario(funcionario.id).subscribe({
      next: (horario) => {
        this.horarioFuncionario = funcionario;
        this.horario = horario;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al consultar horario: ', error);
        this.mostrarError('el horario');
      }
    });

  }

  //Obtiene la asistencia del día actual
  protected get todayAttendance() : Asistencia | undefined {

    const hoy = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Mexico_City'
    }).format(new Date());

    return this.asistencias.find((asistencia) => this.fechaISO(asistencia.fecha) === hoy);

  }

  private mostrarError(tipo : string): void {
    this.notice = `No fue posible cargar ${tipo}.`;
    this.cdr.markForCheck();
  }

  protected name(funcionario : Funcionario): string {
    return `${funcionario.nombre} ${funcionario.apellidos}`;
  }

  protected money(value : number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  protected date(value : string): string {
    return new Intl.DateTimeFormat('es-MX', {
      timeZone: 'UTC'
    }).format(new Date(value));
  }

  protected periodo(pago : PagoSalario): string {
    return `${this.date(pago.periodoInicio)} - ${this.date(pago.periodoFin)}`;
  }

  private fechaISO(value : string): string {
    return new Date(value).toISOString().slice(0, 10);
  }

}
