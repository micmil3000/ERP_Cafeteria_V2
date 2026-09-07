import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  imports: [],
  selector: 'app-app-header',
  styleUrl: './app-header.component.css',
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  
}
