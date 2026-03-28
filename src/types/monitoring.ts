import { iEnterpriseForm } from "./enterprise";
import { iStudentForm } from "./student";
import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iState } from "./state";

export interface iMonitoring extends iRoot{
  student: iStudentForm;
  enterprise: iEnterpriseForm;
  observations: string;
  visit_date: Date | null;
}

export interface iPaginationMonitoring extends iPagination {
  data: iMonitoring[];
}

export interface iParamsMonitoring{
  page?: number;
  limit?: number;
  enabled?: string;
  studentId?: number;
  enterpriseId?: number;
  visit_date_ini?: string;
  visit_date_end?: string;
}

export interface iMonitoringState extends iState {
    monitorings: iMonitoring[];
}

export type iMonitoringForm = Partial<iMonitoring>;