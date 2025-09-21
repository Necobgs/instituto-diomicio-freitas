"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { iEnterprise } from "@/types/enterprise";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";

export default function EnterpriseCreatePage() {

    const router = useRouter();

    const defaultData: iEnterprise = {
        id: 0,
        name: "",
        phone: "",
        cnpj: "",
        created_at: new Date(),
        updated_at: new Date(),
    };
    const [formData, setFormData] = useState<iEnterprise>(defaultData);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "created_at" || name === "updated_at") {
            setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            console.log('Empresa Salva:', formData);
            handleAlert('Empresa salva com sucesso! (Simulação)');
        }
    };

    const handleAlert = (message: string) => {
        setAlertTitle('Sucesso')
        setAlertDesc(message)
        setInfoAlertOpen(true);
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
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData?.phone || ''}
                            onChange={handleInputChange}
                            placeholder="Telefone da empresa"
                        />
                    </div>
                    <div>
                        <label htmlFor="cnpj" className="text-sm font-medium">CNPJ</label>
                        <Input
                            id="cnpj"
                            name="cnpj"
                            value={formData?.cnpj || ''}
                            onChange={handleInputChange}
                            placeholder="CNPJ da empresa"
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
                onClickBtn={() => {router.push('/enterprise');}}
            />
        </div>
    );
}