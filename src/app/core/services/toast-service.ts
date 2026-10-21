import { Injectable, signal } from '@angular/core';
import { Toast, ToastType } from '../models/toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // Señal reactiva que almacena el array de toasts activos
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', duration: number = 3000) {
    const id = Date.now();
    const newToast: Toast = { id, message, type, duration };

    // Añadir el nuevo toast al inicio o final de la lista
    this.toasts.update((currentToasts) => [...currentToasts, newToast]);

    // Auto-eliminar después de que se cumpla la duración
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  showSuccess(message: string, duration: number = 3000) {
    this.show(message, 'success', duration);
  }

  remove(id: number) {
    this.toasts.update((currentToasts) => currentToasts.filter(t => t.id !== id));
  }
}
