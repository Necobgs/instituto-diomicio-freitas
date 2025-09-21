'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { iUser } from "@/types/user";
import { DefaultAlertDialog, InfoAlertDialog } from "@/components/ui/alert-dialog";

export default function UserEditPage() {
    const users: iUser[] = [
        { id: 1, name: 'Emanuel', email: 'emanuel@gmail.com', cpf: '123', created_at: new Date(), updated_at: new Date(), },
        { id: 2, name: 'Lucas', email: 'lucas@gmail.com', cpf: '321', created_at: new Date(), updated_at: new Date(), },
        { id: 3, name: 'usuario', email: 'usuario@gmail.com', cpf: '1234', created_at: new Date(), updated_at: new Date(), },
        { id: 4, name: 'outro usuário', email: 'outrousuario@gmail.com', cpf: '4312', created_at: new Date(), updated_at: new Date(), },
        { id: 5, name: 'alessandro', email: 'alessandro@gmail.com', cpf: '12345', created_at: new Date(), updated_at: new Date(), },
        { id: 6, name: 'margot', email: 'margot@gmail.com', cpf: '54312', created_at: new Date(), updated_at: new Date(), }
    ];

    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const user = users.find(user => user.id.toString() === id);

    const defaultData = {
        id: 0, 
        name: "", 
        email: "", 
        cpf: "", 
        created_at: new Date(),
        updated_at: new Date(),
    }
    // Estado para os campos do formulário
    const [formData, setFormData] = useState<iUser>(user ? user : defaultData);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [alertOpen,setAlertOpen] = useState(false);
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);


    if (!user) {
        return (
            <div className="w-full h-full p-4 flex justify-center items-center text-center">
                <p>Usuário não encontrado :(</p>
            </div>
        );
    }

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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            console.log('Usuário alterado:', formData);
            handleAlert('Usuário alterado com sucesso! (Simulação)');
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
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" className="bg-red-500 hover:bg-red-400" onClick={handleDeleteAlert}>Excluir</Button>
                        <Button type="button" variant="secondary" onClick={() => router.back()}>
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
                onClickBtn={() => {router.push('/user');}}
            />
        </div>
    );
}