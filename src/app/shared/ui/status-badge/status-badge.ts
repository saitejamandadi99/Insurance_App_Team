
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadge {
  @Input({ required: true })
  status!: string;

  get badgeClass(): string {
    const normalizedStatus = this.status
      ?.toLowerCase()
      .replace(/[\s_-]/g, '') ?? '';

    switch (normalizedStatus) {
      case 'active':
      case 'approved':
      case 'completed':
      case 'success':
      case 'paid':
      case 'issued':
      case 'settled':
        return 'success';

      case 'pending':
      case 'pendingpayment':
      case 'pendingapproval':
      case 'underreview':
      case 'inreview':
        return 'warning';

      case 'inactive':
      case 'rejected':
      case 'failed':
      case 'expired':
      case 'cancelled':
      case 'canceled':
        return 'danger';

      default:
        return 'secondary';
    }
  }
}
