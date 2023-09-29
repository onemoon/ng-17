import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-17';
  condition = true;

  $list = signal<{ id: number; name: string }[]>([
    {
      id: 1,
      name: 'Jack',
    },
    {
      id: 2,
      name: 'Tom',
    },
  ]);

  onClick() {
    this.condition = !this.condition;
  }

  addItem() {
    this.$list.update((list) => {
      list.push({ id: list.length, name: Math.random().toString() });
      return list;
    });
  }
}
