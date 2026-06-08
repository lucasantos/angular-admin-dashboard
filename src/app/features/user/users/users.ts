import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private readonly userService = inject<UserService>(UserService);

  // Convert the Observable to a Signal for clean template usage
  protected readonly users = toSignal(this.userService.getUsers(), {
    initialValue: [],
  });

  // Columns to display in the Material Table
  protected readonly displayedColumns: string[] = ['name', 'email', 'role', 'status', 'actions'];
}
