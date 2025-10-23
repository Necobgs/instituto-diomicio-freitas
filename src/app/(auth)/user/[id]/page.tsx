'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { iUser } from "@/types/user";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useSelector } from "react-redux";
import { editUser, selectUsers } from "@/store/features/userSlice";
import { useAppDispatch } from "@/store/hooks";

export default function UserEditPage() {

    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const users = useSelector(selectUsers);
    const user = users.find(user => user.id.toString() === id);
    const dispatch = useAppDispatch();

    const defaultData = {
        id: 0, 
        name: "", 
        email: "", 
        cpf: "",
        password: "",
        enabled: true, 
        created_at: new Date(),
        updated_at: new Date(),
    }
    // Estado para os campos do formulário
    const [formData, setFormData] = useState<iUser>(user ? user : defaultData);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
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

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(editUser({...formData, updated_at: new Date()})).unwrap();
            handleAlert('Sucesso','Usuário alterado com sucesso!');
        } catch (error: any) {
            handleAlert('Erro',error?.message || 'Erro ao alterar usuário');
        }
    };

    const handleDisableOrEnable = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(editUser({...user, enabled: !user?.enabled, updated_at: new Date()})).unwrap();
            router.push('/user');
        } catch (error: any) {
            handleAlert('Erro',error?.message || 'Erro ao alterar empresa');
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
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" className={user?.enabled ? "bg-red-500 hover:bg-red-400" : "bg-green-700 hover:bg-green-600"} onClick={handleDisableOrEnable}>{user?.enabled ? "Desabilitar" : "Habilitar"}</Button>
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