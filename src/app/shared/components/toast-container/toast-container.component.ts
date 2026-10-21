import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getToastClasses(type: string): string {
    const baseClasses = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };
    return baseClasses[type as keyof typeof baseClasses] || baseClasses.info;
  }
}
