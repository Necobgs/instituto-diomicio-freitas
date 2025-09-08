import { ColumnDef } from "@tanstack/react-table";
import { iEnterprise } from "./enterprise";
import { iStudent } from "./student";

export default interface iMonitoring{
    id:number;
    student:iStudent;
    admission_date: Date;
    enterprise:iEnterprise;
    job_title:string;
    hr_contact:string;
    termination_date_ieedf:Date | null;
}

export const monitoringColumns: ColumnDef<iMonitoring>[] = [
  {
    accessorKey: "student.name",
    header: "Nome do Estudante",
    enableSorting: true
  },
  {
    accessorKey: "enterprise.name",
    header: "Nome da Empresa",
    enableSorting: true,
  },
  {
    accessorKey: "job_title",
    header: "Cargo",
    enableSorting: true,
  },
  {
    accessorKey: "hr_contact",
    header: "Contato de RH",
    enableSorting: true,
  },
  {
    accessorKey: "admission_date",
    header: "Data de Admissão",
    enableSorting: true,
    cell: ({ row }) => new Date(row.original.admission_date).toLocaleDateString("pt-BR",{day:'2-digit',month:'2-digit',year:'numeric'}), // Formata a data
  }
];