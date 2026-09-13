import { Component, input, OnInit, output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import type { WorkDay } from '../human-resources-page/human-resources-page.component';

@Component({
  imports: [FormsModule],
  selector: 'app-schedule-form',
  styleUrl: './schedule-form.component.css',
  templateUrl: './schedule-form.component.html',
})
export class ScheduleFormComponent implements OnInit {
  //Variables para recibir, guardar y cancelar el horario
  readonly schedule = input.required<readonly WorkDay[]>();
  readonly save = output<readonly WorkDay[]>();
  readonly cancel = output<void>();
  protected readonly names = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  protected days: { dia: number; descanso: boolean; entrada: string; salida: string }[] = [];
  protected submitted = false;
  //Carga una copia del horario al iniciar
  ngOnInit(): void { this.days = this.schedule().map((day) => ({ ...day })); }
  //Método para validar las horas de trabajo
  protected invalid(day: WorkDay): boolean {
    return !day.descanso && (!/^([01]\d|2[0-3]):[0-5]\d$/.test(day.entrada) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(day.salida) || day.salida <= day.entrada);
  }
  //Método para guardar el horario
  protected submit(form: NgForm): void {
    this.submitted = true;
    if (form.invalid || this.days.some((day) => this.invalid(day))) return;
    this.save.emit(this.days.map((day) => ({ ...day, entrada: day.descanso ? '' : day.entrada, salida: day.descanso ? '' : day.salida })));
  }
}
