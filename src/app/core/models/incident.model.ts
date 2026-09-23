export type IncidentStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export interface Incident {
  readonly id: string;
  title: string;
  description: string;
  category: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  reportId: string;
  assignedAggentId: string;
  createdAt: string;
  updatedAt: string;
}
