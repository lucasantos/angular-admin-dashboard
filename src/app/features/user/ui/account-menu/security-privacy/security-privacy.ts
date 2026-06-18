import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-security-privacy',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatListModule,
    MatTooltipModule,
    TranslocoDirective,
  ],
  templateUrl: './security-privacy.html',
  styleUrl: './security-privacy.scss',
})
export class SecurityPrivacy {
  private readonly fb = inject<FormBuilder>(FormBuilder);

  // Security States
  is2FAEnabled = signal(false);

  // Awareness Form
  securityForm = this.fb.group({
    awareOfTerms: [false, Validators.requiredTrue],
    allowDataProcessing: [true],
    publicProfile: [false],
  });

  // Mock Active Sessions
  sessions = signal([
    {
      device: 'Chrome on Windows',
      location: 'São Paulo, BR',
      ipAdress: '192.168.1.1',
      active: true,
      icon: 'desktop_windows',
    },
    {
      device: 'Safari on iPhone 15',
      location: 'Rio de Janeiro, BR',
      ipAdress: '192.168.1.2',
      active: false,
      icon: 'smartphone',
    },
  ]);

  confirmAwareness() {
    if (this.securityForm.valid) {
      console.log('User has confirmed privacy awareness.');
      // Logic to save timestamp of confirmation
    }
  }

  revokeSession(index: number) {
    this.sessions.update((s) => s.filter((_, i) => i !== index));
  }

  // Counter for active sessions
  get activeSessionsCount() {
    return this.sessions().filter((s) => s.active).length;
  }

  logoutAllSessions() {
    // Clear all sessions logic
    this.sessions.set([]);
  }
}
