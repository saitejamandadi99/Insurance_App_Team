import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '../../services/Toast/toast-service';
import { Subscription } from 'rxjs';
import { Toast } from '../../Enums/Toast';
import { ToastType } from '../../Enums/ToastType';

@Component({
  imports: [],
  standalone:true,
  selector: 'app-toasts',
  styleUrl: './toasts.css',
  templateUrl: './toasts.html',
})
export class Toasts implements OnInit, OnDestroy {

  toasts: Toast[] = [];
  ToastType = ToastType;

  private toastSubscription?: Subscription;

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.toastSubscription = this.toastService.toasts$.subscribe(data => {
      this.toasts = [...data];
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.toastSubscription?.unsubscribe();
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
  }
}
