
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  @Input()
  title: string = '';

  @Input()
  subtitle: string = '';

  @Input()
  buttonText: string = '';

  @Input()
  buttonIcon: string = '';

  @Output()
  buttonClick = new EventEmitter<void>();

  onButtonClick(): void {
    this.buttonClick.emit();
  }
}
