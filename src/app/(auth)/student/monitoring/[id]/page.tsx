"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { iMonitoringForm } from "@/types/monitoring";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { iStudent } from "@/types/student";
import { EnterpriseCombobox } from "@/components/ui/combo-box-enterprise";
import { iEnterprise } from "@/types/enterprise";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { editMonitoring, selectMonitorings } from "@/store/features/monitoringSlice";
import { useSelector } from "react-redux";
import MaskedInput from "@/components/ui/masked-input";
import { Textarea } from "@/components/ui/textarea";

export default function MonitoringEditPage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const monitorings = useSelector(selectMonitorings);
    const monitoring = monitorings.find(monitoring => monitoring.id.toString() === id);

    if(!monitoring){
      return (
        <div className="flex items-center justify-center w-full h-full">
          Acompanhamento não encontrado
        </div>
      )
    }

    const defaultData: iMonitoringForm = {
      student: undefined,
      admission_date: null,
      enterprise: undefined,
      job_title: "",
      hr_contact: "",
      hr_resposible: "",
      termination_date_ieedf: null,
      observations: "",
      created_at: new Date(),
      updated_at: new Date(),
    };
    const [formData, setFormData] = useState<iMonitoringForm>(
      monitoring  
      ? {...monitoring, 
        admission_date: monitoring.admission_date ? new Date(monitoring.admission_date) : null,
        termination_date_ieedf: monitoring.termination_date_ieedf ? new Date(monitoring.termination_date_ieedf) : null} 
      : defaultData);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError,setIsError] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const dispatch = useAppDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]:
          name.includes("date") && value ? new Date(value) : value, // conversão automática
      }));

      if (errors[name as keyof iMonitoringForm]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    };

    const handleMakedInputChange = (name: string, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name as keyof iMonitoringForm]) {
          setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    } 

    const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};
      if (!formData.student) newErrors.student = "Estudante é obrigatório";
      if (!formData.enterprise) newErrors.enterprise = "Empresa é obrigatória";
      if (!formData.job_title) newErrors.job_title = "Função é obrigatória";
      if (formData.hr_contact?.trim() && formData.hr_contact?.trim().length < 10) newErrors.hr_contact = "Contato do RH inválido";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        try {
            await dispatch(editMonitoring(formData)).unwrap();
            handleAlert(false,'Acompanhamento alterado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao alterar acompanhamento');
        }
    };

    const handleAlert = (error: boolean, message: string) => {
        setAlertTitle(error ? "Erro" : "Sucesso");
        setAlertDesc(message)
        setInfoAlertOpen(true);
        setIsError(error);
    }

    return (
        <div className="w-full h-full p-4">
            <section className="min-h-16 flex flex-col gap-5">
                <div className="text-left">
                    <h1 className="text-2xl">Editar acompanhamento</h1>
                </div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 max-w-md"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="student" className="text-sm font-medium">
                    Estudante
                  </label>
                  <StudentCombobox
                    student={formData.student}
                    setStudent={(student: iStudent | undefined) => {
                      setFormData((prev) => ({ ...prev, student }));
                      setErrors((prev) => ({ ...prev, student: '' }));
                    }}
                    error={errors.student}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="enterprise" className="text-sm font-medium">
                    Empresa
                  </label>
                  <EnterpriseCombobox 
                    enterprise={formData?.enterprise} 
                    setEnterprise={
                      (enterprise: iEnterprise | undefined) => {
                        setFormData((prev) => ({ ...prev, enterprise })); 
                        setErrors((prev) => ({ ...prev, enterprise: '' }));
                    }
                    }
                    error={errors.enterprise}
                  />
                </div>
                <div>
                  <label htmlFor="job_title" className="text-sm font-medium">
                    Função
                  </label>
                  <Input
                    id="job_title"
                    name="job_title"
                    value={formData.job_title || ""}
                    onChange={handleInputChange}
                    placeholder="Função"
                    error={errors.job_title}
                  />
                </div>
                <div>
                  <label htmlFor="hr_contact" className="text-sm font-medium">
                    Responsável do RH
                  </label>
                  <Input
                    id="hr_resposible"
                    name="hr_resposible"
                    value={formData.hr_resposible || ""}
                    onChange={handleInputChange}
                    placeholder="Responsável do RH"
                    error={errors.hr_resposible}
                  />
                </div>
                <div>
                  <label htmlFor="hr_contact" className="text-sm font-medium">
                    Contato do RH
                  </label>
                  <MaskedInput
                    value={formData.hr_contact || ""}
                    placeholder="Contato do RH"
                    mask={[{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }]}
                    onChange={(val) => handleMakedInputChange("hr_contact", val)}
                    error={errors.hr_contact}
                  />
                </div>
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
                    error={errors.admission_date}
                  />
                </div>
                <div>
                  <label
                    htmlFor="termination_date_ieedf"
                    className="text-sm font-medium"
                  >
                  Provável data desligamento IEEDF
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
                    error={errors.termination_date_ieedf}
                  />
                </div>
                <div>
                  <label htmlFor="hr_contact" className="text-sm font-medium">
                    Observações
                  </label>
                  <Textarea
                    id="observations"
                    name="observations"
                    value={formData.observations || ""}
                    onChange={(e) => {setFormData((prev) => ({ ...prev, observations: e.target.value }))}}
                    error={errors.observations}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit">Salvar</Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </section>

            <InfoAlertDialog
                message={alertDesc} 
                title={alertTitle} 
                open={infoAlertOpen} 
                onOpenChange={setInfoAlertOpen}
                onClickBtn={() => {isError ? "" : router.push('/student/monitoring');}}
            />
        </div>
    );
}