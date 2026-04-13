"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { defaultReferral, iReferralForm } from "@/types/referral";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { addReferral, selectReferralLoading } from "@/store/features/referralSlice";
import { useSelector } from "react-redux";
import Loading from "@/components/ui/loading";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { iStudentForm } from "@/types/student";
import { EnterpriseCombobox } from "@/components/ui/combo-box-enterprise";
import { iEnterpriseForm } from "@/types/enterprise";
import { JobCombobox } from "@/components/ui/combo-box-job";
import { iJobForm } from "@/types/job";
import { formatDateForInput } from "@/lib/format";

export default function ReferralCreatePage() {

    const router = useRouter();
    const [formData, setFormData] = useState<iReferralForm>(defaultReferral);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError,setIsError] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const loading = useSelector(selectReferralLoading);
    const dispatch = useAppDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
        
        if (errors[name as keyof iReferralForm]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.student) newErrors.student = "Estudante é obrigatório";
        if (!formData.enterprise) newErrors.enterprise = "Empresa é obrigatória";
        if (!formData.job) newErrors.job = "Cargo é obrigatório";
        if (!formData.admissionDate) newErrors.admissionDate = "Data da admissão é obrigatória";
        if (!formData.terminationDateIeedf) newErrors.terminationDateIeedf = "Provável data desligamento IEEDF é obrigatória";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        try {
            const { student, enterprise, job, ...rest } = formData;

            const dataToSubmit = {
                ...rest,
                studentId: student?.id,
                enterpriseId: enterprise?.id,
                jobId: job?.id,
            };

            await dispatch(addReferral({...dataToSubmit})).unwrap();
            handleAlert(false,'Encaminhamento cadastrado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao cadastrar encaminhamento');
            console.log(error)
        }
    };

    const handleAlert = (error: boolean, message: string) => {
        setAlertTitle(error ? "Erro" : "Sucesso");
        setAlertDesc(message)
        setInfoAlertOpen(true);
        setIsError(error);
    }

    return (
        <>
            {loading
                ? <Loading/>
                : <div className="w-full h-full p-4">
                    <section className="min-h-16 flex flex-col gap-5">
                        <div className="text-left">
                            <h1 className="text-2xl">Criar Encaminhamento</h1>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
                            <div>
                                <label htmlFor="student" className="text-sm font-medium">Estudante</label>
                                <StudentCombobox
                                    student={formData.student}
                                    setStudent={(student: iStudentForm | undefined) =>
                                        setFormData((prev) => ({ ...prev, student }))
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="enterprise" className="text-sm font-medium">Empresa</label>
                                <EnterpriseCombobox
                                    enterprise={formData.enterprise}
                                    setEnterprise={(enterprise: iEnterpriseForm | undefined) =>
                                        setFormData((prev) => ({ ...prev, enterprise }))
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="job" className="text-sm font-medium">Cargo</label>
                                <JobCombobox
                                    job={formData.job}
                                    setJob={(job: iJobForm | undefined) =>
                                        setFormData((prev) => ({ ...prev, job }))
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="admissionDate" className="text-sm font-medium">Data da admissão</label>
                                <Input
                                    id="admissionDate"
                                    name="admissionDate"
                                    type="date"
                                    value={formatDateForInput(formData?.admissionDate)}
                                    onChange={handleInputChange}
                                    error={errors.admissionDate}
                                />
                            </div>
                            <div>
                            <label htmlFor="terminationDateIeedf" className="text-sm font-medium">Provável data desligamento IEEDF</label>
                                <Input
                                    id="terminationDateIeedf"
                                    name="terminationDateIeedf"
                                    type="date"
                                    value={formatDateForInput(formData?.terminationDateIeedf)}
                                    onChange={handleInputChange}
                                    error={errors.terminationDateIeedf}
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit">Salvar</Button>
                                <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
                            </div>
                        </form>
                    </section>
                    
                    <InfoAlertDialog
                        message={alertDesc} 
                        title={alertTitle} 
                        open={infoAlertOpen} 
                        onOpenChange={setInfoAlertOpen}
                        onClickBtn={() => {isError ? "" : router.push('/student/referral');}}
                    />
                </div>
            }
        </>
    );
}