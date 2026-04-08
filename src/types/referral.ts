import { iEnterpriseForm } from "./enterprise";
import { iStudentForm } from "./student";
import { iRoot } from "./iRoot";
import { iPagination } from "./pagination";
import { iState } from "./state";
import { iJobForm } from "./job";

export interface iReferral extends iRoot{
  student?: iStudentForm;
  enterprise?: iEnterpriseForm;
  job?: iJobForm;
  studentId?: number;
  enterpriseId?: number;
  jobId?: number;
  admissionDate: Date | null | string;
  terminationDateIeedf: Date | null | string;
}

export type iReferralForm = Partial<iReferral>;

export interface iPaginationReferral extends iPagination {
  data: iReferralForm[];
}

export interface iParamsReferral{
  page?: number;
  limit?: number;
  enabled?: string;
  student?: iStudentForm | undefined;
  enterprise?: iEnterpriseForm | undefined;
  job?: iJobForm | undefined;
  admissionDateIni?: string;
  admissionDateEnd?: string;
  terminationDateIeedfIni?: string;
  terminationDateIeedfEnd?: string;
}

export interface iReferralState extends iState {
    referrals: iReferralForm[];
    referral: iReferralForm | null;
}

export const defaultFilterReferral: iParamsReferral = {
    student: undefined,
    enterprise: undefined,
    job: undefined,
    admissionDateIni: "",
    admissionDateEnd: "",
    terminationDateIeedfIni: "",
    terminationDateIeedfEnd: "",
}

export const defaultReferral: iReferralForm = {
    student: undefined,
    enterprise: undefined,
    job: undefined,
    admissionDate: "",
    terminationDateIeedf: "",
}