import { Service, signal } from '@angular/core';

@Service()
export class ModalService {
  private isOpenSignal = signal<boolean>(false);
  // incidentSeleted = signal<>();
  isOpen = this.isOpenSignal.asReadonly();

  open() {
    this.isOpenSignal.set(true);
  }

  close() {
    this.isOpenSignal.set(false);
  }
}
