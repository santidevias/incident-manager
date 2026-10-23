import { ApiResponse } from "../../../core/models/api-response.model";

export interface DashboardMetrics {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  criticalCount: number;
  byCategory: Record<string, number>;
}

export interface RecentIncidentSummary {
  id: string;
  title: string;
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentIncidents: RecentIncidentSummary[];
}

export interface RecentIncidentsAPIResponse extends ApiResponse<{}> {
  data: RecentIncidentSummary[];
}
export interface DashboardMetricsAPIResponse extends ApiResponse<{}> {
  data: DashboardMetrics;
}
