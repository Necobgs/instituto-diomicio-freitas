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
import MaskedInput from "@/components/ui/masked-input";

export default function UserEditPage() {

    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const users = useSelector(selectUsers);
    const user = users.find(user => user.id.toString() === id);
    const [errors, setErrors] = useState<Record<string, string>>({});
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

    const [formData, setFormData] = useState<iUser>(user ? user : defaultData);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError,setIsError] = useState(false);

    if (!user) {
        return (
            <div className="w-full h-full p-4 flex justify-center items-center text-center">
                <p>Usuário não encontrado :(</p>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "created_at" || name === "updated_at" || name == "date_of_birth") {
            setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (errors[name as keyof iUser]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleMaskedInputChange = (name: string, value: string) => {

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof iUser]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
        if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
        if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório";
        else if (formData.cpf.trim().length < 11) newErrors.cpf = "CPF inválido";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        try {
            await dispatch(editUser({...formData, updated_at: new Date()})).unwrap();
            handleAlert(false,'Usuário alterado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao alterar usuário');
        }
    };

    const handleDisableOrEnable = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(editUser({...user, enabled: !user?.enabled, updated_at: new Date()})).unwrap();
            router.push('/user');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao alterar usuário');
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
                            error={errors.name} 
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
                            error={errors.email}
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
                        <MaskedInput
                            value={formData?.cpf || ''}
                            placeholder="CPF do usuário"
                            mask="000.000.000-00"
                            onChange={(val) => handleMaskedInputChange("cpf",val)}
                            error={errors.cpf}
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
                onClickBtn={() => {isError ? "" : router.push('/user');}}
            />
        </div>
    );
}