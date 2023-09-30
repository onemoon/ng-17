import { CommonModule } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { RouterOutlet } from '@angular/router';
import { ApiInterceptor } from './api/api.interceptor';
import { ApiService } from './api/api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
    },
  ],
})
export class AppComponent implements OnInit, OnDestroy {
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

  $color = signal<string>('blue');
  isLoading = false;

  $userInfo = signal<{ name: string } | undefined>(undefined);

  onDestroy$: Subject<void> = new Subject();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // this.getUserInfo();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onClick() {
    this.condition = !this.condition;
  }

  addItem() {
    this.$list.update((list) => {
      list.push({ id: list.length, name: Math.random().toString() });
      return list;
    });
  }

  btnToggleChange(event: MatButtonToggleChange) {
    this.$color.set(event.value);
  }

  getUserInfo() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.apiService
      .getUserInfo()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data) => {
          this.$userInfo.set(data);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
