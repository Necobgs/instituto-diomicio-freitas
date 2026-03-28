import { iEnterpriseForm } from "./enterprise";
import { iStudentForm } from "./student";
import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iState } from "./state";
import { iJobForm } from "./job";

export interface iReferral extends iRoot{
  student: iStudentForm;
  enterprise: iEnterpriseForm;
  job: iJobForm;
  admission_date: Date | null;
  termination_date_ieedf: Date | null;
}

export interface iPaginationReferral extends iPagination {
  data: iReferral[];
}

export interface iParamsReferral{
  page?: number;
  limit?: number;
  enabled?: string;
  studentId?: number;
  enterpriseId?: number;
  jobId?: number;
  admission_date_ini?: string;
  admission_date_end?: string;
  termination_date_ieedf_ini?: string;
  termination_date_ieedf_end?: string;
}

export interface iReferralState extends iState {
    referrals: iReferral[];
}

export type iReferralForm = Partial<iReferral>;