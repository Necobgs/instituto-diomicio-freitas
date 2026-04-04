import { iEnterpriseForm } from "./enterprise";
import { iStudentForm } from "./student";
import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iState } from "./state";

export interface iMonitoring extends iRoot{
  student: iStudentForm;
  observations: string;
  visitDate: Date | null;
}

export type iMonitoringForm = Partial<iMonitoring>;

export interface iPaginationMonitoring extends iPagination {
  data: iMonitoringForm[];
}

export interface iParamsMonitoring{
  page?: number;
  limit?: number;
  enabled?: string;
  student?: iStudentForm;
  enterprise?: iEnterpriseForm;
  visitDateIni?: string;
  visitDateEnd?: string;
}

export interface iMonitoringState extends iState {
    monitorings: iMonitoring[];
}