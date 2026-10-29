import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  imports: [NgClass, TitleCasePipe],
  standalone:true,
  selector: 'app-action-buttons',
  styleUrl: './action-buttons.css',
  templateUrl: './action-buttons.html',
})
export class ActionButtons  {
  @Input({ required: true })
  actions: string[] = [];

  @Output()
  actionClick = new EventEmitter<string>();

  onAction(action: string): void {
    this.actionClick.emit(action);
  }

  getButtonClass(action: string): string {
    switch (action.toLowerCase()) {
      case 'view':
        return 'btn-outline-info';

      case 'edit':
        return 'btn-outline-primary';

      case 'delete':
      case 'cancel':
      case 'reject':
        return 'btn-outline-danger';

      case 'activate':
      case 'approve':
        return 'btn-outline-success';

      case 'deactivate':
        return 'btn-outline-warning';

      default:
        return 'btn-outline-secondary';
    }
  }

  getIcon(action: string): string {
    switch (action.toLowerCase()) {
      case 'view':
        return 'bi bi-eye';

      case 'edit':
        return 'bi bi-pencil-square';

      case 'delete':
      case 'cancel':
        return 'bi bi-trash';

      case 'activate':
        return 'bi bi-check-circle';

      case 'deactivate':
        return 'bi bi-x-circle';

      case 'approve':
        return 'bi bi-check2-all';

      case 'reject':
        return 'bi bi-ban';

      default:
        return 'bi bi-three-dots';
    }
  }
}
