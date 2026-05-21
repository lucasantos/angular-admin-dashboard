import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-help-menu',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatTooltip, RouterLink, TranslocoDirective],
  templateUrl: './help-menu.html',
  styleUrl: './help-menu.scss',
})
export class HelpMenu {}
