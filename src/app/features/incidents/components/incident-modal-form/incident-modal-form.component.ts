import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserRole } from '../../../../core/models/auth.model';
import { Selectable } from '../../../../core/models/selectable.model';
import { SelectionFormComponent } from '../../../../shared/components/selection-form/selection-form.component';
import { Incident } from '../../models/incident.model';
import { AgentService } from '../../services/agent-service';
import { CategoryService } from '../../services/category-service';
import { IncidentFormService } from '../../services/incident-form-service';

@Component({
  selector: 'app-incident-modal-form',
  imports: [CommonModule, ReactiveFormsModule, SelectionFormComponent],
  templateUrl: './incident-modal-form.component.html',
  styleUrl: './incident-modal-form.component.css',
})
export class IncidentModalFormComponent implements OnInit {
  private agentService = inject(AgentService);
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

  protected onSave = output<Incident>();
  protected onDelete = output<Incident>();
  protected onClose = output();
  protected agents = this.agentService.assignedAggents;
  protected categories = this.categoryService.categories;

  form!: FormGroup;
  isEdit = false;

  onSelected(record: Selectable, key: string): void {
    this.form.patchValue({
      [key]: record.id
    })
  }

  ngOnInit(): void {
    this.isEdit = !!this.incidentToEdit;
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
