"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { defaultReferral, iReferralForm } from "@/types/referral";
import { DefaultAlertDialog, InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { editReferral, getReferralById, removeReferral, restoreReferral, selectReferral, selectReferralLoading } from "@/store/features/referralSlice";
import { useSelector } from "react-redux";
import Loading from "@/components/ui/loading";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { iStudentForm } from "@/types/student";
import { EnterpriseCombobox } from "@/components/ui/combo-box-enterprise";
import { iEnterpriseForm } from "@/types/enterprise";
import { JobCombobox } from "@/components/ui/combo-box-job";
import { iJobForm } from "@/types/job";
import { formatDateForInput } from "@/lib/format";
import { selectCurrentUser } from "@/store/features/userSlice";
import { can } from "@/functions/can";

export default function ReferralCreatePage() {

    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id?.toString() || "0");
    const [formData, setFormData] = useState<iReferralForm>(defaultReferral);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [alertOpen,setAlertOpen] = useState(false);
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError,setIsError] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const referral = useSelector(selectReferral);
    const loading = useSelector(selectReferralLoading);
    const currentUser = useSelector(selectCurrentUser);
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

            await dispatch(editReferral({...dataToSubmit})).unwrap();
            handleAlert(false,'Encaminhamento alterado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao cadastrar encaminhamento');
            console.log(error)
        }
    };

    const handleEnableOrDisable = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!referral?.deleted_at) {
            try {
                await dispatch(removeReferral(id)).unwrap();
                handleAlert(false,'Encaminhamento desabilitado com sucesso!');
            } catch (error: any) {
                handleAlert(true,error?.message || 'Erro ao desabilitar encaminhamento');
            }
        }
        else {
            try {
                await dispatch(restoreReferral(id)).unwrap();
                handleAlert(false,'Encaminhamento reabilitado com sucesso!');
            } catch (error: any) {
                handleAlert(true,error?.message || 'Erro ao reabilitar encaminhamento');
            }
        }

        setAlertOpen(false);
    };

    const getReferral = async (id: number) => {
        try {
            await dispatch(getReferralById(id)).unwrap();
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao buscar encaminhamento');
        }
    };

    const handleAlert = (error: boolean, message: string) => {
        setAlertTitle(error ? "Erro" : "Sucesso");
        setAlertDesc(message)
        setInfoAlertOpen(true);
        setIsError(error);
    };

    useEffect(() => {
        return () => {
            getReferral(id);
        }
    }, []);

    useEffect(() => {
        if (referral) {
            setFormData({...referral});
        }
    }, [referral]);

    return (
        <>
            {loading
                ? <Loading/>
                : <div className="w-full h-full p-4">
                    <section className="min-h-16 flex flex-col gap-5">
                        <div className="text-left">
                            <h1 className="text-2xl">Alterar Encaminhamento</h1>
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
                                {!referral?.deleted_at &&
                                    <>
                                        {can(currentUser, "referral", "update") && (
                                            <Button type="submit">Salvar</Button>
                                        )}
                                        {can(currentUser, "referral", "delete") && (
                                            <Button type="button" className="bg-red-500 hover:bg-red-400" onClick={() => {
                                                setAlertDesc("Tem certeza que deseja desabilitar este registro?");
                                                setAlertOpen(true);
                                            }}>
                                                Desabilitar
                                            </Button>
                                        )}
                                    </>
                                }  
                                {can(currentUser, "referral", "restore") && referral?.deleted_at && (
                                    <Button type="button" className="bg-green-600 hover:bg-green-500" onClick={() => {
                                        setAlertDesc("Tem certeza que deseja reabilitar este registro?"); 
                                        setAlertOpen(true);
                                    }}>
                                        Reabilitar
                                    </Button>
                                )}                             
                                <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
                            </div>
                        </form>
                    </section>

                    <DefaultAlertDialog
                        message={alertDesc} 
                        title="Confirmação" 
                        open={alertOpen} 
                        textBtn="Confirmar" 
                        onClickBtn={handleEnableOrDisable} 
                        onOpenChange={setAlertOpen}
                    />
                    
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