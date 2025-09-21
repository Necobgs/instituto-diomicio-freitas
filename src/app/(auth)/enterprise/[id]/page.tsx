"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { iEnterprise } from "@/types/enterprise";
import { DefaultAlertDialog, InfoAlertDialog } from "@/components/ui/alert-dialog";

export default function EnterpriseEditPage() {

    const enterprises: iEnterprise[] = [
        {
            id: 1,
            name:'Empresa 1',
            phone: "(48) 12345-6789",
            cnpj: '123',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: 2,
            name:'Empresa 2',
            phone: "(48) 12345-6789",
            cnpj: '123',
            created_at: new Date(),
            updated_at: new Date(),
        },
    ];
    
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const enterprise = enterprises.find(enterprise => enterprise.id.toString() === id);

    const defaultData: iEnterprise = {
        id: 0,
        name: "",
        phone: "",
        cnpj: "",
        created_at: new Date(),
        updated_at: new Date(),
    };
    const [formData, setFormData] = useState<iEnterprise>(enterprise ? enterprise : defaultData);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [alertOpen,setAlertOpen] = useState(false);
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);

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

    const handleDeleteAlert = () => {
        setAlertTitle('Confirmação')
        setAlertDesc('Tem certeza que você deseja excluir esse registro?')
        setAlertOpen(true);
    }

    const handleDelete = () => {
        handleAlert('Registro excluído com sucesso! (Simulação)');
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
                        <Button type="button" className="bg-red-500 hover:bg-red-400" onClick={handleDeleteAlert}>Excluir</Button>
                        <Button type="button" variant="secondary" onClick={() => router.push('/enterprise')}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </section>

            <DefaultAlertDialog
                message={alertDesc} 
                title={alertTitle} 
                open={alertOpen} 
                textBtn="Confirmar" 
                onClickBtn={handleDelete} 
                onOpenChange={setAlertOpen}
            />

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