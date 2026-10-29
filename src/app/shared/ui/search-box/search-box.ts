
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-box.html',
  styleUrl: './search-box.css',
})
export class SearchBox {
  @Input({ required: true })
  searchControl!: FormControl<string | null>;

  @Input()
  placeholder: string = 'Search...';

  @Input()
  ariaLabel: string = 'Search records';

  @Output()
  clear = new EventEmitter<void>();

  clearSearch(): void {
    this.searchControl.setValue('');
    this.clear.emit();
  }
}
