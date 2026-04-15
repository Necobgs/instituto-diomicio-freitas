"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { defaultJob, iJobForm } from "@/types/job";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { addJob, selectJobLoading } from "@/store/features/jobSlice";
import { useSelector } from "react-redux";
import Loading from "@/components/ui/loading";

export default function JobCreatePage() {

    const router = useRouter();

    const [formData, setFormData] = useState<iJobForm>(defaultJob);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError,setIsError] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
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
            await dispatch(addJob(formData)).unwrap();
            handleAlert(false,'Cargo cadastrado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao cadastrar cargo');
            console.log(error)
        }
    };

    const handleAlert = (error: boolean, message: string) => {
        setAlertTitle(error ? "Erro" : "Sucesso");
        setAlertDesc(message)
        setInfoAlertOpen(true);
        setIsError(error);
    };

    return (
        <>
            {loading
                ? <Loading/>
                :<div className="w-full h-full p-4">
                    <section className="min-h-16 flex flex-col gap-5">
                        <div className="text-left">
                            <h1 className="text-2xl">Criar Cargo</h1>
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
                                <Button type="submit">Salvar</Button>
                                <Button type="button" variant="secondary" onClick={() => router.push('/job')}>
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
                        onClickBtn={() => {isError ? "" : router.push('/job');}}
                    />
                </div>
            }
        </>
    );
}