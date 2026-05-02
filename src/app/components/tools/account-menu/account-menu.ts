import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from "@angular/material/divider";
import { UserService } from '../../../services/user.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-account-menu',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatTooltip, MatDivider, RouterLink],
  templateUrl: './account-menu.html',
  styleUrl: './account-menu.scss',
})
export class AccountMenu {
  protected readonly userService = inject(UserService);
}
