import { ColumnDef } from "@tanstack/react-table";
import { iEnterprise } from "./enterprise";
import { iStudent } from "./student";
import { iRoot } from "./iRoot";
import { formatDate, formatPhone } from "@/lib/format";

export interface iMonitoring extends iRoot{
    student:iStudent;
    admission_date: Date | null;
    enterprise:iEnterprise;
    job_title:string;
    hr_contact:string;
    hr_resposible:string;
    termination_date_ieedf:Date | null;
    observations:string;
}

export type iMonitoringForm = Partial<iMonitoring>;

export interface iPaginationMonitoring {
  data: iMonitoring[];
  total: number;
}

export interface iParamsMonitoring{
    page?: number;
    limit?: number;
    student?:iStudent;
    admission_date?: string;
    enterprise?:iEnterprise;
    job_title?:string;
    hr_contact?:string;
    hr_resposible?:string;
    termination_date_ieedf?:string;
}

export const monitoringColumns: ColumnDef<iMonitoring>[] = [
  {
    accessorKey: "student.name",
    header: "Nome Estudante",
    enableSorting: true
  },
  {
    accessorKey: "enterprise.name",
    header: "Nome Empresa",
    enableSorting: true,
  },
  {
    accessorKey: "job_title",
    header: "Função",
    enableSorting: true,
  },
  {
    accessorKey: "hr_resposible",
    header: "Responsável RH",
    enableSorting: true,
  },
  {
    accessorKey: "hr_contact",
    header: "Contato RH",
    enableSorting: true,
    cell: ({ row }) =>  formatPhone(row.original.hr_contact),
  },
  {
    accessorKey: "admission_date",
    header: "Data de Admissão",
    enableSorting: true,
    cell: ({ row }) => row.original.admission_date ? formatDate(row.original.admission_date) : "",
  },
  {
    accessorKey: "termination_date_ieedf",
    header: "Prov. Dt. Desl. IEEDF",
    enableSorting: true,
    cell: ({ row }) =>  row.original.termination_date_ieedf ? formatDate(row.original.termination_date_ieedf) : "", // Formata a data
  }
];