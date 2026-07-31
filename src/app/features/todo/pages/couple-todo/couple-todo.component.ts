import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { AppCardComponent } from '../../../../shared/ui/app-card/app-card.component';

export interface TodoItem {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  assignedTo: 'both' | 'Alex' | 'Sophia';
}

@Component({
  selector: 'app-couple-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzIconModule,
    NzTagModule,
    AppCardComponent
  ],
  templateUrl: './couple-todo.component.html',
  styleUrl: './couple-todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoupleTodoComponent {
  newTodoTitle = signal<string>('');

  todos = signal<TodoItem[]>([
    { id: '1', title: 'Đi xem phim rạp cuối tuần 🍿', category: 'Hò hẹn', completed: true, assignedTo: 'both' },
    { id: '2', title: 'Lên kế hoạch du lịch Đà Lạt tháng sau 🌲', category: 'Du lịch', completed: false, assignedTo: 'both' },
    { id: '3', title: 'Cùng nhau học làm bánh dâu tây 🍰', category: 'Kỷ niệm', completed: false, assignedTo: 'Sophia' },
    { id: '4', title: 'Mua cây cảnh nhỏ trang trí ban công 🌿', category: 'Nhà cửa', completed: true, assignedTo: 'Alex' }
  ]);

  completedCount = computed(() => this.todos().filter((t) => t.completed).length);
  totalCount = computed(() => this.todos().length);
  progressPercent = computed(() => Math.round((this.completedCount() / (this.totalCount() || 1)) * 100));

  addTodo(): void {
    const text = this.newTodoTitle().trim();
    if (!text) return;

    const item: TodoItem = {
      id: Date.now().toString(),
      title: text,
      category: 'Kế hoạch',
      completed: false,
      assignedTo: 'both'
    };

    this.todos.update((t) => [item, ...t]);
    this.newTodoTitle.set('');
  }

  toggleTodo(id: string): void {
    this.todos.update((items) =>
      items.map((i) => (i.id === id ? { ...i, completed: !i.completed } : i))
    );
  }

  deleteTodo(id: string): void {
    this.todos.update((items) => items.filter((i) => i.id !== id));
  }
}
