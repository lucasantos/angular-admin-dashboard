import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-articles',
  imports: [RouterOutlet],
  templateUrl: './articles.html',
  styleUrl: './articles.scss',
})
export class Articles {}
