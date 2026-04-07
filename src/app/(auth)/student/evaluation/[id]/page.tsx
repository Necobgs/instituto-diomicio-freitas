"use client";

import { DefaultAlertDialog, InfoAlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { editEvaluation, getEvaluationById, removeEvaluation, selectEvaluation, selectEvaluationLoading } from "@/store/features/evaluationSlice";
import { useAppDispatch } from "@/store/hooks";
import { defaultEvaluation, defaultQuestions, iEvaluationForm } from "@/types/evaluation";
import { iStudentForm } from "@/types/student";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDateForInput } from "@/lib/format";
import { UserCombobox } from "@/components/ui/combo-box-user";
import { iUserForm } from "@/types/user";
import { Question } from "@/components/ui/question";
import { useSelector } from "react-redux";

export default function EvaluationCreatePage() {

    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id?.toString() || "0");
    const [formData, setFormData] = useState<iEvaluationForm>({...defaultEvaluation});
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [alertOpen,setAlertOpen] = useState(false);
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const evaluation = useSelector(selectEvaluation);
    const loading = useSelector(selectEvaluationLoading);
    const dispatch = useAppDispatch();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        if (type === "number") {
            setFormData((prev) => ({ ...prev, [name]: !value ? "" : parseFloat(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (errors[name as keyof iEvaluationForm]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleQuestionChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.student) newErrors.student = "Estudante é obrigatório";
        if (!formData.date) newErrors.date = "Data da avaliação é obrigatória";
        if (!formData?.user) newErrors.user = "Professor é obrigatório";
        if (!formData?.interviewNote && formData?.interviewNote !== 0) newErrors.interviewNote = "Nota da entrevista com os pais é obrigatória";
        if (!formData?.note && formData?.note !== 0) newErrors.note = "Nota da avaliação é obrigatória";
        defaultQuestions.map((question) => {
            if (question.obrigatory && !formData[question.key as keyof iEvaluationForm]) {
                newErrors[question.key] = "Esta questão é obrigatória";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        let errorResponse = false;

        try {
            const { student, user, ...rest } = formData;

            const dataToSubmit = {
                ...rest,
                studentId: student?.id,
                userId: user?.id,
            };

            await dispatch(editEvaluation({...dataToSubmit})).unwrap();
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao alterar avaliação');
            errorResponse = true;
        }

        if (errorResponse) return;

        handleAlert(false,'Avaliação alterada com sucesso!');
    };

    const handleDisable = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(removeEvaluation(id)).unwrap();
            router.push('/student/evaluation');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao desabilitar avaliação');
        }
    }

    const getEvaluation = async (id: number) => {
        try {
            await dispatch(getEvaluationById(id)).unwrap();
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao buscar avaliação');
        }
    }

    const handleAlert = (error: boolean, message: string) => {
        setAlertTitle(error ? "Erro" : "Sucesso");
        setAlertDesc(message)
        setInfoAlertOpen(true);
        setIsError(error);
    }

    useEffect(() => {
        return () => {
            getEvaluation(id);
        }
    }, []);

    useEffect(() => {
        if (evaluation) {
            setFormData({...evaluation});
        }
    }, [evaluation]);

    return (
        <>
            {loading
                ?<Loading/>
                :<div className="w-full h-full p-4">
                    <section className="min-h-16 flex flex-col gap-5">
                        <div className="text-left">
                            <h1 className="text-2xl">Gerar Avaliação</h1>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="font-bold">Estudante</label>
                                <div className="max-w-md">
                                    <StudentCombobox
                                        student={formData?.student}
                                        setStudent={(student: iStudentForm | undefined) => {
                                            setFormData((prev) => ({ ...prev, student }));
                                            setErrors((prev) => ({ ...prev, student: '' }));
                                        }}
                                        error={errors.student}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="font-bold">Professor</label>
                                <div className="max-w-md">
                                    <UserCombobox 
                                        user={formData?.user}
                                        setUser={(user: iUserForm | undefined) => {
                                            setFormData((prev) => ({ ...prev, user }));
                                            setErrors((prev) => ({ ...prev, user: '' }));
                                        }}
                                        error={errors.user}
                                    />
                                </div>
                            </div>
                             <div>
                                <label className="font-bold">Data da avaliação:</label>
                                <div className="max-w-md">
                                    <Input
                                        id="date"
                                        name="date"
                                        type="date"
                                        value={formatDateForInput(formData?.date)}
                                        onChange={handleInputChange} 
                                        error={errors.date}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="font-bold">Nota da entrevista com os pais</label>
                                <div className="max-w-md">
                                    <Input
                                        id="interviewNote"
                                        name="interviewNote"
                                        value={formData?.interviewNote}
                                        type="number"
                                        onChange={handleInputChange}
                                        error={errors.interviewNote} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="font-bold">Nota da avaliação</label>
                                <div className="max-w-md">
                                    <Input
                                        id="note"
                                        name="note"
                                        value={formData?.note}
                                        type="number"
                                        onChange={handleInputChange} 
                                        error={errors.note}
                                    />
                                </div>
                            </div>
                            <div> 
                                {
                                    defaultQuestions.map((question) => (
                                        <Question
                                            key={question.key}
                                            question={question}
                                            value={formData?.[question.key as keyof iEvaluationForm] as string}
                                            onChange={handleQuestionChange}
                                            error={errors[question.key as keyof typeof errors]}
                                        />

                                    ))
                                }
                            </div>
                            <div className="flex gap-3">
                                {!evaluation?.deleted_at &&
                                    <>
                                        <Button type="submit">Salvar</Button>
                                        <Button type="button" className="bg-red-500 hover:bg-red-400" onClick={() => setAlertOpen(true)}>
                                            Desabilitar
                                        </Button>
                                    </>
                                }
                                <Button type="button" variant="secondary" onClick={() => router.push('/student/evaluation')}>
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
                        onClickBtn={() => {isError ? "" : router.push('/student/evaluation');}}
                    />
                </div>
            }
        </>
    );
}