"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { defaultJob, iJobForm } from "@/types/job";
import { DefaultAlertDialog, InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { addJob, editJob, getJobById, removeJob, selectJob, selectJobLoading } from "@/store/features/jobSlice";
import { useSelector } from "react-redux";
import Loading from "@/components/ui/loading";

export default function JobCreatePage() {

    const router = useRouter();
    const params = useParams();
    const id = parseInt(params.id?.toString() || "0");
    const [formData, setFormData] = useState<iJobForm>(defaultJob);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [alertOpen,setAlertOpen] = useState(false);
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError,setIsError] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const job = useSelector(selectJob);
    const loading = useSelector(selectJobLoading);
    const dispatch = useAppDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof iJobForm]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name?.trim()) newErrors.name = "Nome é obrigatório";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await dispatch(editJob(formData)).unwrap();
            handleAlert(false,'Cargo alterado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao alterar cargo');
            console.log(error)
        }
    };

    const handleDisable = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(removeJob(id)).unwrap();
            handleAlert(false,'Cargo desabilitado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao desabilitar cargo');
        }

        setAlertOpen(false);
    };

    const getJob = async (id: number) => {
        try {
            await dispatch(getJobById(id)).unwrap();
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao buscar cargo');
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
            getJob(id);
        }
    }, []);

    useEffect(() => {
        if (job) {
            setFormData({...job});
        }
    }, [job]);

    return (
        <>
            {loading
                ? <Loading/>
                :<div className="w-full h-full p-4">
                    <section className="min-h-16 flex flex-col gap-5">
                        <div className="text-left">
                            <h1 className="text-2xl">Alterar Cargo</h1>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
                            <div>
                                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData?.name || ''}
                                    onChange={handleInputChange}
                                    placeholder="Nome do cargo"
                                    error={errors.name}
                                />
                            </div>
                            <div className="flex gap-3">
                                {!job?.deleted_at &&
                                    <>
                                        <Button type="submit">Salvar</Button>
                                        <Button type="button" className="bg-red-500 hover:bg-red-400" onClick={() => setAlertOpen(true)}>
                                            Desabilitar
                                        </Button>
                                    </>
                                }
                                <Button type="button" variant="secondary" onClick={() => router.push('/job')}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </section>

                    <DefaultAlertDialog
                        message="Tem certeza que deseja desabilitar este registro?" 
                        title="Confirmação" 
                        open={alertOpen} 
                        textBtn="Confirmar" 
                        onClickBtn={handleDisable} 
                        onOpenChange={setAlertOpen}
                    />

                    <InfoAlertDialog
                        message={alertDesc}
                        title={alertTitle}
                        open={infoAlertOpen}
                        onOpenChange={setInfoAlertOpen}
                        onClickBtn={() => {isError ? "" : router.push('/job');}}
                    />
                </div>
            }
        </>
    );
}