// pages/user/user-shell.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-shell',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`, // Crucial: This renders the children (Users or UserDetail)
})
export class UserShell {}
