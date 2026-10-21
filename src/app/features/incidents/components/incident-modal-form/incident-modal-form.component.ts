import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User, UserRole } from '../../../../core/models/auth.model';
import { Selectable } from '../../../../core/models/selectable.model';
import { ProfileService } from '../../../../core/services/profile-service';
import { SelectionFormComponent } from '../../../../shared/components/selection-form/selection-form.component';
import { Incident } from '../../models/incident.model';
import { CategoryService } from '../../services/category-service';
import { IncidentFormService } from '../../services/incident-form-service';

@Component({
  selector: 'app-incident-modal-form',
  imports: [CommonModule, ReactiveFormsModule, SelectionFormComponent],
  templateUrl: './incident-modal-form.component.html',
  styleUrl: './incident-modal-form.component.css',
})
export class IncidentModalFormComponent implements OnInit {
  private profileService = inject(ProfileService);

  private categoryService = inject(CategoryService);
  private formService = inject(IncidentFormService);
  protected statusIncident = signal<Selectable[]>([
    {
      "id": "OPEN",
      "name": "Abierto",
    },
    {
      "id": "IN_PROGRESS",
      "name": "En progreso",
    },
    {
      "id": "CLOSED",
      "name": "Resuelto",
    },
  ]);
  protected priorityIncident = signal<Selectable[]>([{ "id": "LOW", "name": "Baja" }, { "id": "MEDIUM", "name": "Media" }, { "id": "HIGH", "name": "Alta" }, { "id": "CRITICAL", "name": "Crítica" }])

  isOpen = input.required<boolean>();
  incidentToEdit = input<Incident>();
  currentRole = input.required<UserRole>();
  currentUser = input.required<User | null>();

  protected onSave = output<Incident>();
  protected onDelete = output<Incident>();
  protected onClose = output();
  protected agents = this.profileService.assignedAgents;
  public agentSelected = computed(() => {
    const id = this.incidentToEdit()?.assignedAgentId;
    if (!id) return null; // Si no hay usuario o ID, retornamos null
    return this.profileService.assignedAgents().find(agent => agent.id === id)?.name || null;
  });
  public userSelected = computed(() => {
    const id = this.incidentToEdit()?.reportId ?? this.currentUser()?.id;
    if (!id) return null;

    return this.profileService.users().find(user => (user.id === id))?.name || null;
  });
  protected categories = this.categoryService.categories;

  form!: FormGroup;
  isEdit = false;

  onSelected(record: Selectable, key: string): void {
    this.form.patchValue({
      [key]: record.id
    })
  }

  ngOnInit(): void {
    this.isEdit = !!this.incidentToEdit();
    this.form = this.formService.buildForm(this.currentRole(), this.incidentToEdit());
  }

  onSubmit() {
    if (this.form.valid) {
      const incidentData = this.form.getRawValue() as Incident;
      this.onSave.emit(incidentData);
    }
  }

  delete(): void {
    const incidentData = this.form.getRawValue() as Incident;
    this.onDelete.emit(incidentData);
  }

}
