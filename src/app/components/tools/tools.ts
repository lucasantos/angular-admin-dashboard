import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSelector } from "./theme-selector/theme-selector";
import { LanguageSelector } from "./language-selector/language-selector";
import { HelpMenu } from "./help-menu/help-menu";
import { NotificationCenter } from "./notification-center/notification-center";
import { AccountMenu } from "./account-menu/account-menu";

@Component({
  selector: 'app-tools',
  imports: [
    CommonModule,
    ThemeSelector,
    LanguageSelector,
    HelpMenu,
    NotificationCenter,
    AccountMenu,
  ],
  template: `
    <div class="tools-container">
      <app-theme-selector />
      <app-language-selector />
      <app-help-menu />
      <app-notification-center />
      <app-account-menu />
    </div>
  `,
  styleUrl: './tools.scss',
})
export class Tools {}
