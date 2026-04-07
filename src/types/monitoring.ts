import { iEnterpriseForm } from "./enterprise";
import { iStudentForm } from "./student";
import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iState } from "./state";

export interface iMonitoring extends iRoot{
  student: iStudentForm;
  observations: string;
  visitDate: Date | null | string;
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
  visitDateIni?: string;
  visitDateEnd?: string;
}

export interface iMonitoringState extends iState {
  monitorings: iMonitoringForm[];
  monitoring: iMonitoringForm | null;
}

export const defaulFilterMonitoring: iParamsMonitoring = {
  student: undefined,
  visitDateIni: "",
  visitDateEnd: "",
  enabled: "true",
};

export const defaultMonitoring: iMonitoringForm = {
  student: undefined,
  visitDate: "",
  observations: "",
};