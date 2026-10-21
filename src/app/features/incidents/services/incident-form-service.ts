import { inject, Service } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { UserRole } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { Incident, IncidentPriority, IncidentStatus } from '../models/incident.model';

@Service()
export class IncidentFormService {

  private fb = inject(NonNullableFormBuilder);
  private authSerivce = inject(AuthService);

  private currentUser = this.authSerivce.currentUser;

  /**
   * Genera el formulario configurado y bloqueado según el rol del usuario
   */
  buildForm(role: UserRole, incident?: Incident) {
    const form = this.fb.group({
      id: [incident?.id ?? this.generateUUID()],
      title: [incident?.title ?? '', [Validators.required, Validators.minLength(5)]],
      description: [incident?.description ?? '', Validators.required],
      category: [incident?.category ?? '', Validators.required],
      priority: [incident?.priority ?? 'LOW' as IncidentPriority, Validators.required],
      status: [incident?.status ?? 'OPEN' as IncidentStatus, Validators.required],
      reportId: [incident?.reportId ?? this.getCurrentUser()],
      assignedAgentId: [incident?.assignedAgentId ?? ''],
      createdAt: [incident?.createdAt ?? new Date().toISOString()],
      updatedAt: [new Date().toISOString()],
    });

    // Aplicar restricciones basadas en Roles (Seguridad a nivel de Formulario)
    this.applyRoleRestrictions(form, role, !!incident);

    return form;
  }

  private applyRoleRestrictions(form: any, role: UserRole, isEdit: boolean) {
    // 1. Campos que NUNCA cambian manualmente en la UI
    form.get('id')?.disable();
    form.get('reportId')?.disable();
    form.get('createdAt')?.disable();
    form.get('updatedAt')?.disable();

    // 2. Restricciones para el Solicitante (Requester)
    if (role === 'requester') {
      if (isEdit) {
        // Un solicitante solo puede ver su incidente, no editar nada si ya fue creado
        form.disable();
      } else {
        // En creación, no puede asignarse agente ni cambiar estado/prioridad
        form.get('status')?.disable();
        form.get('priority')?.disable();
        form.get('assignedAgentId')?.disable();
      }
    }

    // 3. Restricciones para el Agente de Soporte
    if (role === 'support') {
      // El agente atiende el problema, no debería editar la queja inicial del usuario y no puede asignarle un agente diferente
      if (isEdit && form.get('status').value === 'CLOSED') {
        form.disable();
      } else if (isEdit) {
        form.get('title')?.disable();
        form.get('priority')?.disable();
        form.get('description')?.disable();
        form.get('category')?.disable();
        form.get('assignedAgentId')?.disable();
      }
    }

    // Nota: El 'admin' no entra a estos ifs, por lo que tiene todos los campos activos.
  }

  private generateUUID(): string {
    return crypto.randomUUID();
  }

  private getCurrentUser(): string {
    return this.currentUser()?.id || ''
  }
}
