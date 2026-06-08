import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../../../../features/user/services/user.service';
import { MatDivider } from "@angular/material/divider";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { AuthService } from '../../../../../core/services/auth.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatDivider,
    MatButtonToggleModule,
    TranslocoDirective
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly fb = inject<FormBuilder>(FormBuilder);
  protected readonly userService = inject<UserService>(UserService);
  protected readonly authService = inject<AuthService>(AuthService);
  private readonly translocoService = inject<TranslocoService>(TranslocoService);
  private readonly snackBar = inject<MatSnackBar>(MatSnackBar);

  // Signal to toggle between avatar URL and file upload modes
  avatarMode = signal<'url' | 'upload'>('url');

  // Signals for UI state
  hidePassword = signal(true);
  isEditing = signal(false);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        // tenantId: user.tenantId -> read-only
      });
    }
  }

  // Form for Personal Data
  profileForm = this.fb.group({
    name: [this.authService.currentUser()?.name, [Validators.required]],
    email: [this.authService.currentUser()?.email, [Validators.required, Validators.email]],
    phone: [this.authService.currentUser()?.phone, [Validators.pattern(/^\+?[0-9\s\-()]+$/)]],
    avatarUrl: [this.authService.currentUser()?.avatarUrl],
    bio: [this.authService.currentUser()?.bio],
  });

  // Form for Password Update
  passwordForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Update the form and the preview immediately
        this.profileForm.patchValue({ avatarUrl: base64String });
        this.profileForm.get('avatarUrl')?.markAsDirty();
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.userService.updateProfile(this.profileForm.value as any);
      this.snackBar.open(
        this.translocoService.translate('pages.profile.personalInformation.profileUpdated'),
        this.translocoService.translate('buttons.close'),
        {
          duration: 3000,
        },
      );
      this.isEditing.set(false);
    }
  }

  updatePassword() {
    if (this.passwordForm.valid) {
      // TO DO: Add logic to verify newPassword === confirmPassword
      if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
        this.snackBar.open(
          this.translocoService.translate('pages.profile.updatePassword.passwordComparison'),
          this.translocoService.translate('buttons.close'),
          {
            duration: 3000,
          },
        );
        return;
      }
      this.snackBar.open(
        this.translocoService.translate('pages.profile.updatePassword.passwordUpdated'),
        this.translocoService.translate('buttons.close'),
        {
          duration: 3000,
        },
      );
      this.passwordForm.reset();
    }
  }
}
