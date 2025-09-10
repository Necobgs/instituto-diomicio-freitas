"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { iMonitoringForm } from "@/types/monitoring";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { iStudent } from "@/types/student";
import { EnterpriseCombobox } from "@/components/ui/combo-box-enterprise";
import { iEnterprise } from "@/types/enterprise";



export default function MonitoringEditPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<iMonitoringForm>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("date") && value ? new Date(value) : value, // conversão automática
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Estudante Salvo:", formData);
    alert("Estudante salvo com sucesso! (Simulação)");
    router.push("/student");
  };

  return (
    <div className="w-full h-full p-4">
      <section className="min-h-16 flex flex-col gap-5">
        <h1 className="text-2xl">Editar acompanhamento</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 max-w-md"
        >
          {/* Aluno */}
          <div className="flex flex-col gap-2">
            <label htmlFor="student" className="text-sm font-medium">
              Aluno
            </label>
            <StudentCombobox
              student={formData.student}
              setStudent={(student: iStudent | undefined) =>
                setFormData((prev) => ({ ...prev, student }))
              }
            />
          </div>

          {/* Empresa */}
          <div className="flex flex-col gap-2">
            <label htmlFor="enterprise" className="text-sm font-medium">
              Empresa
            </label>
                <EnterpriseCombobox 
                    enterprise={formData?.enterprise} 
                    setEnterprise={
                        (enterprise: iEnterprise | undefined) => setFormData((prev) => ({ ...prev, enterprise }))
                        }
                />
          </div>

          {/* Datas */}
          <div>
            <label htmlFor="admission_date" className="text-sm font-medium">
              Data de admissão
            </label>
            <Input
              id="admission_date"
              name="admission_date"
              type="date"
              value={
                formData.admission_date
                  ? formData.admission_date.toISOString().split("T")[0]
                  : ""
              }
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label
              htmlFor="termination_date_ieedf"
              className="text-sm font-medium"
            >
              Data de desligamento
            </label>
            <Input
              id="termination_date_ieedf"
              name="termination_date_ieedf"
              type="date"
              value={
                formData.termination_date_ieedf
                  ? formData.termination_date_ieedf.toISOString().split("T")[0]
                  : ""
              }
              onChange={handleInputChange}
            />
          </div>

          {/* Contato RH */}
          <div>
            <label htmlFor="hr_contact" className="text-sm font-medium">
              Contato do RH
            </label>
            <Input
              id="hr_contact"
              name="hr_contact"
              value={formData.hr_contact || ""}
              onChange={handleInputChange}
              placeholder="Contato do RH"
            />
          </div>

          {/* Cargo */}
          <div>
            <label htmlFor="job_title" className="text-sm font-medium">
              Cargo
            </label>
            <Input
              id="job_title"
              name="job_title"
              value={formData.job_title || ""}
              onChange={handleInputChange}
              placeholder="Cargo"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button type="submit">Salvar</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/student")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
