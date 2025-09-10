"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import iMonitoring, { iMonitoringForm } from "@/types/monitoring";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { iStudent } from "@/types/student";
import { EnterpriseCombobox } from "@/components/ui/combo-box-enterprise";
import { iEnterprise } from "@/types/enterprise";

export default function MonitoringEditPage() {

    const monitoringData: iMonitoring[] = [
      {
        id: 1,
        student: {
          id: 1,
          name: "João Silva",
          phone: "(11) 91234-5678",
          date_of_birth: new Date("2000-05-15"),
          cpf: "123.456.789-00",
        },
        admission_date: new Date("2023-02-01"),
        enterprise: {
          id: 1,
          name: "Tech Solutions Ltda",
          phone: "(11) 3232-1010",
          cnpj: "12.345.678/0001-99",
        },
        job_title: "Desenvolvedor Frontend",
        hr_contact: "rh@techsolutions.com",
        termination_date_ieedf: new Date("2024-08-30"),
      },
      {
        id: 2,
        student: {
          id: 2,
          name: "Maria Oliveira",
          phone: "(21) 98765-4321",
          date_of_birth: new Date("1998-11-22"),
          cpf: "987.654.321-00",
        },
        admission_date: new Date("2023-06-15"),
        enterprise: {
          id: 2,
          name: "Design Criativo S/A",
          phone: "(21) 4567-8901",
          cnpj: "98.765.432/0001-88",
        },
        job_title: "Designer Gráfico",
        hr_contact: "rh@designcriativo.com",
        termination_date_ieedf: null,
      },
      {
        id: 3,
        student: {
          id: 3,
          name: "Pedro Santos",
          phone: "(31) 99876-5432",
          date_of_birth: new Date("2001-03-10"),
          cpf: "456.789.123-00",
        },
        admission_date: new Date("2024-01-20"),
        enterprise: {
          id: 3,
          name: "Inovação Consultoria",
          phone: "(31) 3344-5566",
          cnpj: "45.678.912/0001-77",
        },
        job_title: "Analista de Projetos",
        hr_contact: "rh@inovacaoconsultoria.com",
        termination_date_ieedf: null,
      },
    ];

    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const monitoring = monitoringData.find(monitoring => monitoring.id.toString() === id);

    if(!monitoring){
      return (
        <div className="flex items-center justify-center w-full h-full">
          Página não encontrada
        </div>
      )
    }
    
    const [formData, setFormData]                   = useState<iMonitoringForm>(monitoring);
    const [cbEnterpriseValue, setCbEnterpriseValue] = useState(formData?.enterprise?.name ?? ' ')
    const [enterprise, setEnterprise]               = useState<iEnterprise | undefined>(undefined)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => {
        if (!prev) return prev;
        if (name === "admission_date" || name === "termination_date_ieedf") {
          return {
            ...prev,
            [name]: value ? new Date(value) : null,
          };
        }
        return { ...prev, [name]: value };
      });
  };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            console.log('Estudante Salvo:', formData);
            alert('Estudante salvo com sucesso! (Simulação)');
            router.push('/student');
        }
    };

    return (
        <div className="w-full h-full p-4">
            <section className="min-h-16 flex flex-col gap-5">
                <div className="text-left">
                    <h1 className="text-2xl">Editar acompanhamento</h1>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="student" className="text-sm font-medium">Aluno</label>
                        <StudentCombobox 
                        student={formData?.student} 
                        setStudent={
                          (student: iStudent | undefined) => setFormData((prev) => ({ ...prev, student }))
                          }
                          />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="enterprise" className="text-sm font-medium">Empresa</label>
                        <EnterpriseCombobox 
                        enterprise={formData?.enterprise} 
                        setEnterprise={
                          (enterprise: iEnterprise | undefined) => setFormData((prev) => ({ ...prev, enterprise }))
                          }/>
                    </div>
                    <div>
                        <label htmlFor="admission_date" className="text-sm font-medium">Data de admissão</label>
                        <Input
                            id="admission_date"
                            name="admission_date"
                            value={formData?.admission_date ? formData.admission_date.toISOString().split("T")[0] : ""}
                            onChange={handleInputChange}
                            type="date"
                            placeholder="Data de admissão"
                            />
                    </div>
                    <div>
                        <label htmlFor="admission_date" className="text-sm font-medium">Data de admissão</label>
                        <Input
                            id="admission_date"
                            name="admission_date"
                            value={formData?.termination_date_ieedf ? formData?.termination_date_ieedf.toISOString().split("T")[0] : ""}
                            onChange={handleInputChange}
                            type="date"
                            placeholder="Data de admissão"
                        />
                    </div>
                    <div>
                        <label htmlFor="hr_contact" className="text-sm font-medium">Contato do RH</label>
                        <Input
                            id="hr_contact"
                            name="hr_contact"
                            value={formData?.hr_contact || ''}
                            onChange={handleInputChange}
                            placeholder="Contato do RH"
                        />
                    </div>
                    <div>
                        <label htmlFor="job_title" className="text-sm font-medium">Cargo</label>
                        <Input
                            id="job_title"
                            name="job_title"
                            value={formData?.job_title || ''}
                            onChange={handleInputChange}
                            placeholder="Cargo"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="secondary" onClick={() => router.push('/student')}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}