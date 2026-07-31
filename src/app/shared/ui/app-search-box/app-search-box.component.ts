import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzIconModule],
  templateUrl: './app-search-box.component.html',
  styleUrl: './app-search-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppSearchBoxComponent {
  placeholder = input<string>('Search memories or messages...');
  value = signal<string>('');

  searchChange = output<string>();

  onModelChange(val: string): void {
    this.value.set(val);
    this.searchChange.emit(val);
  }
}
