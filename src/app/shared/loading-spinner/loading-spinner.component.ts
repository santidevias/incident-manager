import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css',
})
export class LoadingSpinnerComponent {
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  color = input<string>('#3b82f6'); // Azul de Tailwind por defecto (blue-500)
  loadingText = input<string>('');

  // Cambiado 'border-3' por 'border-4' (ya que border-3 no existe en Tailwind)
  protected sizeClasses = input<Record<string, string>>({
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  });
}
