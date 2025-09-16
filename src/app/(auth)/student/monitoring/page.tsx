"use client";

import { DefaultAlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/table";
import iMonitoring, { monitoringColumns } from "@/types/monitoring";
import { useRouter } from "next/navigation";
import { useState } from "react";

const monitoringData: iMonitoring[] = [
  {
    id: 1,
    student: {
      id: 1,
      name: "João Silva",
      phone: "(11) 91234-5678",
      date_of_birth: new Date("2000-05-15"),
      cpf: "123.456.789-00",
      created_at: new Date(),
      updated_at: new Date(),
    },
    admission_date: new Date("2023-02-01"),
    enterprise: {
      id: 1,
      name: "Tech Solutions Ltda",
      phone: "(11) 3232-1010",
      cnpj: "12.345.678/0001-99",
      created_at: new Date(),
      updated_at: new Date()
    },
    job_title: "Desenvolvedor Frontend",
    hr_contact: "rh@techsolutions.com",
    termination_date_ieedf: new Date("2024-08-30"),
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    student: {
      id: 2,
      name: "Maria Oliveira",
      phone: "(21) 98765-4321",
      date_of_birth: new Date("1998-11-22"),
      cpf: "987.654.321-00",
      created_at: new Date(),
      updated_at: new Date(),
    },
    admission_date: new Date("2023-06-15"),
    enterprise: {
      id: 2,
      name: "Design Criativo S/A",
      phone: "(21) 4567-8901",
      cnpj: "98.765.432/0001-88",
      created_at: new Date(),
      updated_at: new Date(),
    },
    job_title: "Designer Gráfico",
    hr_contact: "rh@designcriativo.com",
    termination_date_ieedf: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    student: {
      id: 3,
      name: "Pedro Santos",
      phone: "(31) 99876-5432",
      date_of_birth: new Date("2001-03-10"),
      cpf: "456.789.123-00",
      created_at: new Date(),
      updated_at: new Date(),
    },
    admission_date: new Date("2024-01-20"),
    enterprise: {
      id: 3,
      name: "Inovação Consultoria",
      phone: "(31) 3344-5566",
      cnpj: "45.678.912/0001-77",
      created_at: new Date(),
      updated_at: new Date(),
    },
    job_title: "Analista de Projetos",
    hr_contact: "rh@inovacaoconsultoria.com",
    termination_date_ieedf: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

export default function MonitoringPage() {
  const router = useRouter();
  const [alertTitle, setAlertTitle] = useState('')
  const [alertDesc, setAlertDesc ]  = useState('')
  const [alertOpen,setAlertOpen ]   = useState(false)

  function handleAlert(id: number) {
    setAlertTitle('Confirmação')
    setAlertDesc('Tem certeza que você deseja excluir esse registro?')
    setAlertOpen(true);
  }

  function handleEdit(id: number) {
    router.push(`/student/monitoring/${id}`);
  }

  function handleDelete(id: number) {
    console.log('Excluindo...')
  }

  return (
    <div className="w-full h-full p-4 flex flex-col">
      <section className="min-h-16 flex flex-col gap-5">
        <div className="text-left">
          <h1 className="text-2xl">Buscar usuários alunos ao trabalho</h1>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-4">
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="Nome do aluno" />
          </div>
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="Data Admissão" type="date" />
          </div>
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="Empresa" />
          </div>
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="Função" />
          </div>
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="Contato RH" />
          </div>
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="Provável data desligamento IEEDF" type="date" />
          </div>
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Button className="w-full">Buscar</Button>
          </div>
        </div>
      </section>

      <Separator className="mt-6" />

      <section className="mt-4 flex-auto">
        <DataTable
          columns={monitoringColumns}
          data={monitoringData}
          canEdit={true}
          canDelete={true}
          handleDelete={handleAlert}
          handleEdit={handleEdit}
        />
      </section>

      <PaginationComponent
          cbNext={()=>{console.log('Próxima página')}} 
          cbPrevius={()=>{console.log('Página anterior')}}
          hasNextPage={true}
          hasPreviousPage={true}
          pageActivated={3}
      />

      <button
        className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer"
        onClick={() => {
          router.push("/student/monitoring/create");
        }}
      >+
      </button>

        <DefaultAlertDialog 
            message={alertDesc} 
            title={alertTitle} 
            open={alertOpen} 
            textBtn="Confirmar" 
            onClickBtn={handleDelete} 
            onOpenChange={setAlertOpen}
        />

    </div>
  );
}