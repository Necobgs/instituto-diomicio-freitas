"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { iStudentForm } from "@/types/student";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { addStudent } from "@/store/features/studentSlice";

export default function StudentEditPage() {

    const router = useRouter();

    const defaultData: iStudentForm = {
        name: "",
        phone: "",
        date_of_birth: null,
        cpf: "",
        enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
    const [formData, setFormData] = useState<iStudentForm>(defaultData);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError, setIsError] = useState(false);
    const dispatch = useAppDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "created_at" || name === "updated_at" || name == "date_of_birth") {
            setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(addStudent(formData)).unwrap();
            handleAlert(false,'Estudante cadastrado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao cadastrar estudante');
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
                    <h1 className="text-2xl">Criar Estudante</h1>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium">Nome</label>
                        <Input
                            id="name"
                            name="name"
                            value={formData?.name || ''}
                            onChange={handleInputChange}
                            placeholder="Nome do estudante"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData?.phone || ''}
                            onChange={handleInputChange}
                            placeholder="Telefone do estudante"
                        />
                    </div>
                    <div>
                        <label htmlFor="date_of_birth" className="text-sm font-medium">Data de nascimento</label>
                        <Input
                            id="date_of_birth"
                            name="date_of_birth"
                            value={formData?.date_of_birth ? formData?.date_of_birth.toISOString().split("T")[0] : ""}
                            onChange={handleInputChange}
                            type="date"
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
                        <Input
                            id="cpf"
                            name="cpf"
                            value={formData?.cpf || ''}
                            onChange={handleInputChange}
                            placeholder="CPF do estudante"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="secondary" onClick={() => router.push('/student')}>
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
                onClickBtn={() => {isError ? "" : router.push('/student');}}
            />
        </div>
    );
}