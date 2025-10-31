'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { iUserForm } from "@/types/user";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { registerUser } from "@/store/features/userSlice";
import MaskedInput from "@/components/ui/masked-input";

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
    const [formData,setFormData] = useState<iUserForm>(defaultData);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError,setIsError] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const dispatch = useAppDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "created_at" || name === "updated_at" || name == "date_of_birth") {
            setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (errors[name as keyof iUserForm]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleMaskedInputChange = (name: string, value: string) => {

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof iUserForm]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name?.trim()) newErrors.name = "Nome é obrigatório";
        if (!formData.email?.trim()) newErrors.email = "Email é obrigatório";
        if (!formData.cpf?.trim()) newErrors.cpf = "CPF é obrigatório";
        else if (formData.cpf.trim().length < 11) newErrors.cpf = "CPF inválido";
        if (!formData.password?.trim()) newErrors.password = "Senha é obrigatória";
        else if (formData.password.trim().length < 6) newErrors.password = "Senha deve ter ao menos 6 caracteres";
        else if (formData.password.trim().length > 20) newErrors.password = "Senha deve ter no máximo 20 caracteres";
        else if (!/[A-Z]/.test(formData.password)) newErrors.password = "Senha deve conter ao menos uma letra maiúscula";
        else if (!/[a-z]/.test(formData.password)) newErrors.password = "Senha deve conter ao menos uma letra minúscula";
        else if (!/[0-9]/.test(formData.password)) newErrors.password = "Senha deve conter ao menos um número";
        else if (!/[!@#$%^&*]/.test(formData.password)) newErrors.password = "Senha deve conter ao menos um caractere especial (!@#$%^&*)";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        try {
            await dispatch(registerUser(formData)).unwrap();
            handleAlert(false,'Usuário cadastrado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao cadastrar usuário');
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
                    <div>
                        <label htmlFor="password" className="text-sm font-medium">Senha</label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData?.password || ''}
                            onChange={handleInputChange}
                            placeholder="Senha do usuário"
                            error={errors.password}
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
                onClickBtn={() => {isError ? "" : router.push('/user');}}
            />
        </div>
    );
}