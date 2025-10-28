"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { iEnterprise } from "@/types/enterprise";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useSelector } from "react-redux";
import { editEnterprise, selectEnterprises } from "@/store/features/enterpriseSlice";
import { useAppDispatch } from "@/store/hooks";
import MaskedInput from "@/components/ui/masked-input";

export default function EnterpriseEditPage() {
    
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const enterprises = useSelector(selectEnterprises);
    const enterprise = enterprises.find(enterprise => enterprise.id.toString() === id);
    const defaultData: iEnterprise = {
        id: 0,
        name: "",
        phone: "",
        cnpj: "",
        enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
    const [formData, setFormData] = useState<iEnterprise>(enterprise ? enterprise : defaultData);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError,setIsError] = useState(false);
    const dispatch = useAppDispatch();

    if (!enterprise) {
        return (
            <div className="w-full h-full p-4 flex justify-center items-center text-center">
                <p>Empresa não encontrada :(</p>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "created_at" || name === "updated_at") {
            setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(editEnterprise({...formData, updated_at: new Date()})).unwrap();
            handleAlert(false,'Empresa alterada com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao alterar empresa');
        }
    };

    const handleDisableOrEnable = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(editEnterprise({...enterprise, enabled: !enterprise?.enabled, updated_at: new Date()})).unwrap();
            router.push('/enterprise');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao alterar empresa');
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
                    <h1 className="text-2xl">Editar Empresa</h1>
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
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                        <MaskedInput
                            value={formData?.phone || ''}
                            placeholder="Telefone da empresa"
                            mask={[{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }]}
                            onChange={(val) =>
                                setFormData((prev) => ({ ...prev, phone: val }))
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="cnpj" className="text-sm font-medium">CNPJ</label>
                        <MaskedInput
                            value={formData?.cnpj || ''}
                            placeholder="CNPJ da empresa"
                            mask="00.000.000/0000-00"
                            onChange={(val) =>
                                setFormData((prev) => ({ ...prev, cnpj: val }))
                            }
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" className={enterprise?.enabled ? "bg-red-500 hover:bg-red-400" : "bg-green-700 hover:bg-green-600"} onClick={handleDisableOrEnable}>{enterprise?.enabled ? "Desabilitar" : "Habilitar"}</Button>
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
                onClickBtn={() => {isError ? "" : router.push('/user');}}
            />
        </div>
    );
}