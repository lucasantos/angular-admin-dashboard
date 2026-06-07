import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from "@angular/material/divider";
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../services/auth.service';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-account-menu',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatTooltip, MatDivider, RouterLink, TranslocoDirective],
  templateUrl: './account-menu.html',
  styleUrl: './account-menu.scss',
})
export class AccountMenu {
  private readonly router = inject(Router);
  protected readonly userService = inject(UserService);
  protected readonly authService = inject(AuthService);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
