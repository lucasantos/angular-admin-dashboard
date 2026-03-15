import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomSidenav } from "./components/custom-sidenav/custom-sidenav";

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, CustomSidenav],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Dashboard');
  protected readonly logo = 'icons/icon-72x72.png';

  collapsed = signal(false);

  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
}
