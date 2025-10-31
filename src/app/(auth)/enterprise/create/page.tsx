"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { iEnterpriseForm } from "@/types/enterprise";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { addEnterprise } from "@/store/features/enterpriseSlice";
import MaskedInput from "@/components/ui/masked-input";

export default function EnterpriseCreatePage() {

    const router = useRouter();

    const defaultData: iEnterpriseForm = {
        name: "",
        phone: "",
        cnpj: "",
        enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
    const [formData, setFormData] = useState<iEnterpriseForm>(defaultData);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError,setIsError] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const dispatch = useAppDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "created_at" || name === "updated_at") {
            setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (errors[name as keyof iEnterpriseForm]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleMaskedInputChange = (name: string, value: string) => {

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof iEnterpriseForm]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name?.trim()) newErrors.name = "Nome é obrigatório";
        if (!formData.phone?.trim()) newErrors.phone = "Telefone é obrigatório";
        else if (formData.phone?.trim().length < 10) newErrors.phone = "Telefone inválido";
        if (!formData.cnpj?.trim()) newErrors.cnpj = "CNPJ é obrigatório";
        else if (formData.cnpj?.trim().length < 14) newErrors.cnpj = "CNPJ inválido";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        try {
            await dispatch(addEnterprise(formData)).unwrap();
            handleAlert(false,'Empresa cadastrada com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao cadastrar empresa');
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
                    <h1 className="text-2xl">Criar Empresa</h1>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium">Nome</label>
                        <Input
                            id="name"
                            name="name"
                            value={formData?.name || ''}
                            onChange={handleInputChange}
                            placeholder="Nome da empresa"
                            error={errors.name}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                        <MaskedInput
                            value={formData?.phone || ''}
                            placeholder="Telefone da empresa"
                            mask={[{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }]}
                            onChange={(val) => handleMaskedInputChange("phone",val)}
                            error={errors.phone}
                        />
                    </div>
                    <div>
                        <label htmlFor="cnpj" className="text-sm font-medium">CNPJ</label>
                        <MaskedInput
                            value={formData?.cnpj || ''}
                            placeholder="CNPJ da empresa"
                            mask="00.000.000/0000-00"
                            onChange={(val) => handleMaskedInputChange("cnpj",val)}
                            error={errors.cnpj}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="secondary" onClick={() => router.push('/enterprise')}>
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
                onClickBtn={() => {isError ? "" : router.push('/enterprise');}}
            />
        </div>
    );
}