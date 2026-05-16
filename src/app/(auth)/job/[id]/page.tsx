"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { defaultJob, iJobForm } from "@/types/job";
import { DefaultAlertDialog, InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { editJob, getJobById, removeJob, restoreJob, selectJob, selectJobLoading } from "@/store/features/jobSlice";
import { useSelector } from "react-redux";
import Loading from "@/components/ui/loading";
import { selectCurrentUser } from "@/store/features/userSlice";
import { can } from "@/functions/can";
import { ExportModal } from "@/components/ui/export-modal";

export default function JobCreatePage() {

    const router = useRouter();
    const params = useParams();
    const id = parseInt(params.id?.toString() || "0");
    const [formData, setFormData] = useState<iJobForm>(defaultJob);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [alertOpen,setAlertOpen] = useState(false);
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [exportOpen,setExportOpen] = useState(false);
    const [isError,setIsError] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const job = useSelector(selectJob);
    const loading = useSelector(selectJobLoading);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useAppDispatch();

    const getExportRows = () => {
        const source = formData?.id === job?.id ? formData : job || {};

        const rows: (string | number)[][] = [
            ["Informação","Dados"],
            ["Nome", source.name || ""],
        ];

        return rows;
    };

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
            handleAlert(false,'Cargo editado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao editar cargo');
            console.log(error)
        }
    };

    const handleEnableOrDisable = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!job?.deleted_at) {
            try {
                await dispatch(removeJob(id)).unwrap();
                handleAlert(false,'Cargo desabilitado com sucesso!');
            } catch (error: any) {
                handleAlert(true,error?.message || 'Erro ao desabilitar cargo');
            }
        }
        else {
            try {
                await dispatch(restoreJob(id)).unwrap();
                handleAlert(false,'Cargo reabilitado com sucesso!');
            } catch (error: any) {
                handleAlert(true,error?.message || 'Erro ao reabilitar cargo');
            }
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
        if (id) {
            getJob(id);
        }
    }, [id]);

    useEffect(() => {
        if (job?.id === id) {
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
                            <h1 className="text-2xl">Editar Cargo</h1>
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
                            <div className="flex flex-wrap gap-3">
                                {!job?.deleted_at &&
                                    <>
                                        {can(currentUser,"job","update") && (
                                            <Button type="submit">Salvar</Button>
                                        )}
                                        {can(currentUser,"job","delete") && (
                                            <Button type="button" className="bg-red-500 hover:bg-red-400" onClick={() => {
                                                setAlertDesc("Tem certeza que deseja desabilitar este registro?");
                                                setAlertOpen(true);
                                            }}>
                                                Desabilitar
                                            </Button>
                                        )}
                                    </>
                                }
                                {can(currentUser,"job","restore") && job?.deleted_at && (
                                    <Button type="button" className="bg-green-600 hover:bg-green-500" onClick={() => {
                                        setAlertDesc("Tem certeza que deseja reabilitar este registro?");
                                        setAlertOpen(true);
                                    }}>
                                        Reabilitar
                                    </Button>
                                )}
                                <Button type="button" className="bg-gray-500 hover:bg-gray-400" onClick={() => setExportOpen(true)}>
                                    Exportar
                                </Button>
                                <Button type="button" variant="secondary" onClick={() => router.push('/job')}>
                                    Cancelar
                                </Button>
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
                        onClickBtn={() => {isError ? "" : router.push('/job');}}
                    />

                    <ExportModal
                        name={`cargo${job?.id}`}
                        title="Cargo"
                        rows={getExportRows()}
                        open={exportOpen}
                        onOpenChange={setExportOpen}
                    />
                </div>
            }
        </>
    );
}