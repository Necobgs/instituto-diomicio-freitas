'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { defaultUser, iUserForm } from "@/types/user";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import MaskedInput from "@/components/ui/masked-input";
import { addUser, selectCurrentUser } from "@/store/features/userSlice";
import Loading from "@/components/ui/loading";
import { PermissionModal } from "@/components/ui/permission-modal";
import { useSelector } from "react-redux";
import { can } from "@/functions/can";
import { validateCPF } from "@/functions/validateCpf";

export default function UserCreatePage() {
    const router = useRouter();
    // Estado para os campos do formulário
    const [formData,setFormData] = useState<iUserForm>(defaultUser);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError,setIsError] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [permissionsOpen, setPermissionsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const currentUser = useSelector(selectCurrentUser);
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
        if (!formData.username?.trim()) newErrors.username = "Nome é obrigatório";
        if (!formData.email?.trim()) newErrors.email = "Email é obrigatório";
        if (!formData.cpf?.trim()) newErrors.cpf = "CPF é obrigatório";
        else if (!validateCPF(formData.cpf)) newErrors.cpf = "CPF inválido";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        try {
            setLoading(true);
            await dispatch(addUser(formData)).unwrap();
            handleAlert(false,'Usuário cadastrado com sucesso!');
            setLoading(false);
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao cadastrar usuário');
            setLoading(false);
        }
    };

    const handleAlert = (error: boolean, message: string) => {
        setAlertTitle(error ? "Erro" : "Sucesso");
        setAlertDesc(message)
        setInfoAlertOpen(true);
        setIsError(error);
    }

    return (
        <>
            {loading
                ? <Loading/>
                :<div className="w-full h-full p-4">
                        <section className="min-h-16 flex flex-col gap-5">
                            <div className="text-left">
                                <h1 className="text-2xl">Cadastrar Usuário</h1>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
                                <div>
                                    <label htmlFor="username" className="text-sm font-medium">Nome</label>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={formData?.username || ''}
                                        onChange={handleInputChange}
                                        placeholder="Nome do usuário"
                                        error={errors.username}
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
                                <div className="flex flex-wrap gap-3">
                                    {can(currentUser, "user", "create") && (
                                        <>
                                            <Button type="submit">Salvar</Button>
                                            {can(currentUser, "permission", "read") && (
                                                <Button type="button" className="bg-blue-600 hover:bg-blue-400" onClick={() => setPermissionsOpen(true)}>
                                                    Permissões
                                                </Button>
                                            )}
                                        </>
                                    )}
                                    <Button type="button" variant="secondary" onClick={() => router.back()}>
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </section>

                        <PermissionModal
                            open={permissionsOpen}
                            onOpenChange={setPermissionsOpen}
                            formData={formData}
                            setFormData={setFormData}
                        />

                        <InfoAlertDialog
                            message={alertDesc} 
                            title={alertTitle} 
                            open={infoAlertOpen} 
                            onOpenChange={setInfoAlertOpen}
                            onClickBtn={() => {isError ? "" : router.push('/user');}}
                        />
                    </div>
            }
        </>
    );
}