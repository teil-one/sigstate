import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { sigstate } from '@sigstate/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo-payment';
  count = sigstate('demo.count', 0);

  onClick() {
    this.count.update(value => value + 1);
  }
}