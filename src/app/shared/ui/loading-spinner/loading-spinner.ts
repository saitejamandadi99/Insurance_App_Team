
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css',
})
export class LoadingSpinner {
  @Input()
  message: string = 'Loading...';

  @Input()
  size: 'sm' | 'md' | 'lg' = 'md';
}
