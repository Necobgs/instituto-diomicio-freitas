'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PermissionModal } from "@/components/ui/permission-modal";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { defaultUser, iUserForm } from "@/types/user";
import { DefaultAlertDialog, InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useSelector } from "react-redux";
import { editUser, getUserById, getUserPermissionsById, removeUser, selectCurrentUser, selectUser, selectUserLoading, selectUserPermissions } from "@/store/features/userSlice";
import { useAppDispatch } from "@/store/hooks";
import MaskedInput from "@/components/ui/masked-input";
import Loading from "@/components/ui/loading";
import { can } from "@/functions/can";

export default function UserEditPage() {

    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = parseInt(params?.id?.toString() || "");
    const [loading, setLoading] = useState(false);
    const user = useSelector(selectUser);
    const userPermissions = useSelector(selectUserPermissions);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<iUserForm>(defaultUser);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [alertOpen,setAlertOpen] = useState(false);
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError,setIsError] = useState(false);
    const [permissionsOpen, setPermissionsOpen] = useState(false);
    const currentUser = useSelector(selectCurrentUser);

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
        if (!formData.username?.trim()) newErrors.name = "Nome é obrigatório";
        if (!formData.email?.trim()) newErrors.email = "Email é obrigatório";
        if (!formData.cpf?.trim()) newErrors.cpf = "CPF é obrigatório";
        else if (formData.cpf?.trim().length < 11) newErrors.cpf = "CPF inválido";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        try {
            setLoading(true);
            await dispatch(editUser({...formData})).unwrap();
            setLoading(false);
            handleAlert(false,'Usuário alterado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao alterar usuário');
            setLoading(false);
        }
    };

    const handleDisable = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            await dispatch(removeUser(id)).unwrap();
            setLoading(false);
            handleAlert(false,'Usuário desabilitado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao desabilitar usuário');
            setLoading(false);
        }

        setAlertOpen(false);
    };

    const getUser = async (id: number) => {
        try {
            setLoading(true);
            await dispatch(getUserById(id)).unwrap();
            getUserPermissions(id);
            setLoading(false);
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao buscar usuário');
            setLoading(false);
        }
    };

    const getUserPermissions = async (id: number) => {
        try {
            setLoading(true);
            await dispatch(getUserPermissionsById(id)).unwrap();
            setLoading(false);
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao buscar permissões do usuário');
            setLoading(false);
        }
    };

    const handleAlert = (error: boolean, message: string) => {
        setAlertTitle(error ? "Erro" : "Sucesso");
        setAlertDesc(message)
        setInfoAlertOpen(true);
        setIsError(error);
    }

    useEffect(() => {
        if (id) {
            getUser(id);
        }
    }, [id]);

    useEffect(() => {
        if (user) {
            setFormData({...user});
        }
    }, [user]);

    useEffect(() => {

        let permissionsId = userPermissions?.map((perm) => (perm?.id ? perm.id : 0)) || [];

        if (userPermissions) {
            setFormData((prev) => ({...prev, permissionsId: permissionsId}));
        }
    }, [userPermissions]);

    return (
        <>
            {loading
                ? <Loading/>
                : <div className="w-full h-full p-4">
                        <section className="min-h-16 flex flex-col gap-5">
                            <div className="text-left">
                                <h1 className="text-2xl">Editar Usuário</h1>
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
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex flex-wrap gap-3">
                                        {!user?.deleted_at &&
                                            <>
                                                {can(currentUser, "user", "update") && (
                                                    <Button type="submit">Salvar</Button>
                                                )}
                                                {can(currentUser, "user", "delete") && (
                                                    <Button type="button" className="bg-red-500 hover:bg-red-400" onClick={() => setAlertOpen(true)}>
                                                        Desabilitar
                                                    </Button>
                                                )}
                                            </>
                                        }
                                        {can(currentUser, "permission", "read") && (
                                            <Button type="button" className="bg-blue-600 hover:bg-blue-400" onClick={() => setPermissionsOpen(true)}>
                                                Permissões
                                            </Button>
                                        )}
                                        <Button type="button" variant="secondary" onClick={() => router.back()}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </section>

                        <PermissionModal
                            open={permissionsOpen}
                            onOpenChange={setPermissionsOpen}
                            formData={formData}
                            setFormData={setFormData}
                        />

                        <DefaultAlertDialog
                            message="Tem certeza que deseja desabilitar este registro?" 
                            title="Confirmação" 
                            open={alertOpen} 
                            textBtn="Confirmar" 
                            onClickBtn={handleDisable} 
                            onOpenChange={setAlertOpen}
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