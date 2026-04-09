import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from "@angular/material/divider";
import { CommonModule } from '@angular/common';
import { ThemeSelector } from "./theme-selector/theme-selector";
import { LanguageSelector } from "./language-selector/language-selector";
import { HelpMenu } from "./help-menu/help-menu";

@Component({
  selector: 'app-tools',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
    MatMenuModule,
    MatBadgeModule,
    MatDivider,
    ThemeSelector,
    LanguageSelector,
    HelpMenu
],
  templateUrl: './tools.html',
  styleUrl: './tools.scss',
})
export class Tools {}
