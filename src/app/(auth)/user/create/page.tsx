'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { iUserForm } from "@/types/user";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { addUser } from "@/store/features/userSlice";

export default function UserCreatePage() {
    const router = useRouter();

    const defaultData = {
        name: "", 
        email: "",
        password: "",
        cpf: "", 
        enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
    }
    // Estado para os campos do formulário
    const [formData, setFormData] = useState<iUserForm>(defaultData);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const dispatch = useAppDispatch();

    // Função para atualizar o estado ao alterar os inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "created_at" || name === "updated_at") {
            setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Função para simular o envio do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(addUser(formData)).unwrap();
            handleAlert('Sucesso','Usuário cadastrado com sucesso!');
        } catch (error: any) {
            handleAlert('Erro',error?.message || 'Erro ao cadastrar usuário');
        }
    };

    const handleAlert = (title: string, message: string) => {
        setAlertTitle(title)
        setAlertDesc(message)
        setInfoAlertOpen(true);
    }

    return (
        <div className="w-full h-full p-4">
            <section className="min-h-16 flex flex-col gap-5">
                <div className="text-left">
                    <h1 className="text-2xl">Editar Usuário</h1>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium">Nome</label>
                        <Input
                            id="name"
                            name="name"
                            value={formData?.name || ''}
                            onChange={handleInputChange}
                            placeholder="Nome do usuário"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData?.email || ''}
                            onChange={handleInputChange}
                            placeholder="Email do usuário"
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
                        <Input
                            id="cpf"
                            name="cpf"
                            value={formData?.cpf || ''}
                            onChange={handleInputChange}
                            placeholder="CPF do usuário"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium">Senha</label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData?.password || ''}
                            onChange={handleInputChange}
                            placeholder="Senha do usuário"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="secondary" onClick={() => router.back()}>
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
                onClickBtn={() => {router.push('/user');}}
            />
        </div>
    );
}