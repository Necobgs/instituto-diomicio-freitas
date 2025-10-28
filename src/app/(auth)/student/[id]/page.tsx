"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { iStudent } from "@/types/student";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useSelector } from "react-redux";
import { editStudent, selectStudents } from "@/store/features/studentSlice";
import { useAppDispatch } from "@/store/hooks";
import MaskedInput from "@/components/ui/masked-input";

export default function StudentEditPage() {
    
    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const students = useSelector(selectStudents);
    const student: iStudent | undefined = students.find(student => student.id.toString() === id);
    const [isError, setIsError] = useState(false);

    const defaultData: iStudent = {
        id: 0,
        name: "",
        phone: "",
        date_of_birth: null,
        cpf: "",
        enabled: true,
        created_at: new Date(),
        updated_at: new Date(),
    };

    const [formData, setFormData] = useState<iStudent>(student ? student : defaultData);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const dispatch = useAppDispatch();

    if (!student) {
        return (
            <div className="w-full h-full p-4 flex justify-center items-center text-center">
                <p>Estudante não encontrado :(</p>
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

        if (errors[name as keyof iStudent]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleMaskedInputChange = (name: string, value: string) => {

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof iStudent]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
        if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
        else if (formData.phone.trim().length < 10) newErrors.phone = "Telefone inválido";
        if (!formData.date_of_birth) newErrors.date_of_birth = "Data de nascimento é obrigatória";
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
            await dispatch(editStudent({...formData, updated_at: new Date()})).unwrap();
            handleAlert(false,'Estudante alterado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao alterar estudante');
        }
    };

    const handleDisableOrEnable = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(editStudent({...student, enabled: !student?.enabled, updated_at: new Date()})).unwrap();
            router.push('/student');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao alterar estudante');
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
                    <h1 className="text-2xl">Editar Estudante</h1>
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
                            error={errors.name}
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                        <MaskedInput
                            value={formData?.phone || ''}
                            placeholder="Telefone do estudante"
                            mask={[{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }]}
                            onChange={(val) => handleMaskedInputChange("phone", val)}
                            error={errors.phone}
                        />
                    </div>
                    <div>
                        <label htmlFor="date_of_birth" className="text-sm font-medium">Data de nascimento</label>
                        <Input
                            id="date_of_birth"
                            name="date_of_birth"
                            value={formData?.date_of_birth ? new Date(formData?.date_of_birth).toISOString().split("T")[0] : ""}
                            onChange={handleInputChange}
                            type="date"
                            error={errors.date_of_birth}
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
                        <MaskedInput
                            value={formData?.cpf || ''}
                            placeholder="CPF do estudante"
                            mask="000.000.000-00"
                            onChange={(val) => handleMaskedInputChange("cpf", val)}
                            error={errors.cpf}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" className={student?.enabled ? "bg-red-500 hover:bg-red-400" : "bg-green-700 hover:bg-green-600"} onClick={handleDisableOrEnable}>{student?.enabled ? "Desabilitar" : "Habilitar"}</Button>
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