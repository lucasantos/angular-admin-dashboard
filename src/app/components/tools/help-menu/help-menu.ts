import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-help-menu',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatTooltip],
  templateUrl: './help-menu.html',
  styleUrl: './help-menu.scss',
})
export class HelpMenu {}
