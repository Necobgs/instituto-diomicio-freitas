"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { defaultStudent, iStudentForm } from "@/types/student";
import { DefaultAlertDialog, InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useAppDispatch } from "@/store/hooks";
import { editStudent, getStudentById, removeStudent, selectStudent, selectStudentLoading } from "@/store/features/studentSlice";
import MaskedInput from "@/components/ui/masked-input";
import { formatDateForInput } from "@/lib/format";
import { useSelector } from "react-redux";
import Loading from "@/components/ui/loading";
import { Combobox } from "@/components/ui/combo-box";
import { Textarea } from "@/components/ui/textarea";

export default function StudentEditPage() {

    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id?.toString() || "0");
    const [formData, setFormData] = useState<iStudentForm>(defaultStudent);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [alertOpen,setAlertOpen] = useState(false);
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const student = useSelector(selectStudent);
    const loading = useSelector(selectStudentLoading);
    const dispatch = useAppDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "useMedicine") {
            setFormData((prev) => ({ ...prev, [name]: value === "true" }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        if (errors[name as keyof iStudentForm]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleMaskedInputChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof iStudentForm]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.name?.trim()) newErrors.name = "Nome é obrigatório";
        if (!formData.phone?.trim()) newErrors.phone = "Telefone é obrigatório";
        else if (formData.phone?.trim().length < 10) newErrors.phone = "Telefone inválido";
        if (!formData?.dateBirthday) newErrors.dateBirthday = "Data de nascimento é obrigatória";
        if (!formData.cpf?.trim()) newErrors.cpf = "CPF é obrigatório";
        else if (formData.cpf?.trim().length < 11) newErrors.cpf = "CPF inválido";
        if (!formData.responsibleName?.trim()) newErrors.responsibleName = "Nome do responsável é obrigatório";
        if (!formData.responsiblePhone?.trim()) newErrors.responsiblePhone = "Telefone do responsável é obrigatório";
        else if (formData.responsiblePhone?.trim().length < 10) newErrors.responsiblePhone = "Telefone do responsável inválido";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        try {
            await dispatch(editStudent(formData)).unwrap();
            handleAlert(false,'Estudante atualizado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao atualizar estudante');
        }
    };

    const handleDisable = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(removeStudent(formData)).unwrap();
            handleAlert(false,'Estudante removido com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao remover estudante');
        }

        setAlertOpen(false);
    };

    const getStudent = async (id: number) => {
        try {
            await dispatch(getStudentById(id)).unwrap();
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao buscar estudante');
        }
    };

    const handleAlert = (error: boolean, message: string) => {
        setAlertTitle(error ? "Erro" : "Sucesso");
        setAlertDesc(message)
        setInfoAlertOpen(true);
        setIsError(error);
    };

    useEffect(() => {
        return () => {
            getStudent(id);
        }
    }, []);

    useEffect(() => {
        if (student) {
            setFormData({...student});
        }
    }, [student]);

    return (
        <>
            {loading
                ?<Loading/>
                :<div className="w-full h-full p-4">
                    <section className="min-h-16 flex flex-col gap-5">
                        <div className="text-left">
                            <h1 className="text-2xl">Alterar Estudante</h1>
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
                                    onChange={(val) => handleMaskedInputChange("phone",val)}
                                    error={errors.phone} 
                                />
                            </div>
                            <div>
                                <label htmlFor="dateBirthday" className="text-sm font-medium">Data de nascimento</label>
                                <Input
                                    id="dateBirthday"
                                    name="dateBirthday"
                                    value={formatDateForInput(formData?.dateBirthday)}
                                    onChange={handleInputChange}
                                    type="date"
                                    error={errors.dateBirthday}
                                />
                            </div>
                            <div>
                                <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
                                <MaskedInput
                                    value={formData?.cpf || ''}
                                    placeholder="CPF do estudante"
                                    mask="000.000.000-00"
                                    onChange={(val) => handleMaskedInputChange("cpf",val)}
                                    error={errors.cpf}
                                />
                            </div>
                            <div>
                                <label htmlFor="responsibleName" className="text-sm font-medium">Nome do Responsável</label>
                                <Input
                                    id="responsibleName"
                                    name="responsibleName"
                                    value={formData?.responsibleName || ''}
                                    onChange={handleInputChange}
                                    placeholder="Nome do responsável"
                                    error={errors.responsibleName}
                                />
                            </div>
                            <div>
                                <label htmlFor="responsiblePhone" className="text-sm font-medium">Telefone do Responsável</label>
                                <MaskedInput
                                    value={formData?.responsiblePhone || ''}
                                    placeholder="Telefone do responsável"
                                    mask={[{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }]}
                                    onChange={(val) => handleMaskedInputChange("responsiblePhone",val)}
                                    error={errors.responsiblePhone} 
                                />
                            </div>
                            <div>
                                <label htmlFor="dateEntry" className="text-sm font-medium">Data de entrada</label>
                                <Input
                                    id="dateEntry"
                                    name="dateEntry"
                                    value={formatDateForInput(formData?.dateEntry)}
                                    onChange={handleInputChange}
                                    type="date"
                                    error={errors.dateEntry}
                                />
                            </div>
                            <div>
                                <label htmlFor="useMedicine" className="text-sm font-medium">Usa medicamentos?</label>
                                <Combobox
                                    items={[{ value: "true", label: "Sim" }, { value: "false", label: "Não" }]}
                                    value={formData?.useMedicine?.toString()}
                                    setValue={(value) => setFormData(prev => ({ ...prev, useMedicine: value === "true" }))}
                                    placeholder="Usa medicamentos?"
                                    searchPlaceholder="Buscar opção..."
                                    notFoundMessage="Nenhuma situação encontrada"
                                />
                            </div>
                            <div>
                                <label htmlFor="infoMedicine" className="text-sm font-medium">Informações sobre medicamentos</label>
                                <Textarea
                                    id="infoMedicine"
                                    name="infoMedicine"
                                    value={formData?.infoMedicine || ''}
                                    onChange={handleInputChange}
                                    rows={3}
                                    error={errors.infoMedicine}
                                />
                            </div>
                            <div className="flex gap-3">
                                {!student?.deleted_at &&
                                    <>
                                        <Button type="submit">Salvar</Button>
                                        <Button type="button" className="bg-red-500 hover:bg-red-400" onClick={() => setAlertOpen(true)}>
                                            Desabilitar
                                        </Button>
                                    </>
                                }
                                <Button type="button" variant="secondary" onClick={() => router.push('/student')}>
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </section>

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
                        onClickBtn={() => {isError ? "" : router.push('/student');}}
                    />
                </div>
        }
        </>
    );
}