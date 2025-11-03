"use client";

import { DefaultAlertDialog, InfoAlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { Question } from "@/components/ui/question";
import { addEvaluation, editEvaluation, removeEvaluation, selectEvaluations } from "@/store/features/evaluationSlice";
import { addQuestion, editQuestion, initQuestions, removeQuestion, selectQuestionError, selectQuestionLoading, selectQuestions } from "@/store/features/questionSlice";
import { useAppDispatch } from "@/store/hooks";
import { iEvaluationForm } from "@/types/evaluation";
import { iQuestionForm } from "@/types/question";
import { iStudent } from "@/types/student";
import { Check } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatDateForInput } from "@/lib/format";

export default function EvaluationCreatePage() {

    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const evaluations = useSelector(selectEvaluations);
    const questionsSelecteds = useSelector(selectQuestions);
    const errorQuestion = useSelector(selectQuestionError);
    const loadingQuestion = useSelector(selectQuestionLoading);
    const evaluation = evaluations.find(evaluation => evaluation.id.toString() === id);

    const defaultData: iEvaluationForm = {
        student: undefined,
        entry_date: null,
        date: null,
        teacher_name: "",
        interview_note: 0,
        note: 0,
    }

    const [formData, setFormData] = useState<iEvaluationForm>(evaluation ? evaluation : defaultData);
    const [questions, setQuestions] = useState<iQuestionForm[]>([]);
    const [questionsDeleteds, setQuestionsDeleteds] = useState<iQuestionForm[]>([]);
    const [formAdd, setFormAdd] = useState({type: "", title: ""});
    const [loaded, setLoaded] = useState(false);
    const [alertTitle,setAlertTitle] = useState('');
    const [alertDesc,setAlertDesc] = useState('');
    const [alertOpen,setAlertOpen] = useState(false);
    const [infoAlertOpen,setInfoAlertOpen] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        dispatch(initQuestions({ limit: 1000, page: 1, id_evaluation: Number(id) }));
    },[dispatch, id]);

    useEffect(() => {
        if (!loaded && questionsSelecteds.length > 0) {
            const uniqueQuestions = questionsSelecteds
                .filter((q, index, self) => index === self.findIndex(t => t.order === q.order))
                .sort((a, b) => (a.order || 0) - (b.order || 0)); 
            setQuestions(uniqueQuestions);
            setLoaded(true);
        }
    }, [questionsSelecteds, loaded]);
    
    if (!evaluation || errorQuestion) {
        return (
            <div className="w-full h-full p-4 flex justify-center items-center text-center">
                <p>{errorQuestion ? errorQuestion : "Avaliação não encontrada :("}</p>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "created_at" || name === "updated_at" || name == "date" || name == "entry_date") {
            setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        if (errors[name as keyof iEvaluationForm]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleQuestionChange = ( question: iQuestionForm, value: string ) => {
        setQuestions((oldQuestions) => {
            const newQuestions = oldQuestions.map((q) => {
                if (q.order === question.order) {
                    return { ...q, value };
                }
                return q;
            });
            return newQuestions;
        })
    }

    const handleFormAddChange = ( name: string, value: string ) => {
        setFormAdd((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof iEvaluationForm]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }

    const handleAddQuestion = () => {

        if (!validateFormAddQuestion()) {
            return; 
        }

        const maxOrderQuestion = 
        questions[0] 
        ? questions.reduce((max, current) => {
            const maxOrder = max?.order || 0;
            const currentOrder = current?.order || 0;
            return currentOrder > maxOrder ? current : max;
        })
        : null;

        const newQuestion: iQuestionForm = {
            type: formAdd.type,
            title: formAdd.title,
            value: "",
            order: maxOrderQuestion?.order ? maxOrderQuestion.order + 1 : 1,
        };

        setQuestions((prev) => ([...prev, newQuestion]));
        setFormAdd({type: "", title: ""});
    }

    const handleRemoveQuestion = ( question: iQuestionForm ) => {
        setQuestions((prev) => {
            const remaining = prev.filter((q) => q.order !== question.order);
            const reordered = remaining.map((field, i) => ({
                ...field,
                order: i + 1,
            }));
            return reordered;
        });

        if (question.id) {
            setQuestionsDeleteds((prev) => ([...prev, question]));
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.student) newErrors.student = "Estudante é obrigatório";
        if (!formData.entry_date) newErrors.entry_date = "Data de entrada é obrigatória";
        if (!formData.date) newErrors.date = "Data da avaliação é obrigatória";
        if (!formData?.teacher_name) newErrors.teacher_name = "Nome do professor é obrigatório";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateFormAddQuestion = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formAdd.type) newErrors.type = "Tipo é obrigatório";
        if (!formAdd.title.trim()) newErrors.title = "Enunciado é obrigatório";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = questions.findIndex((f) => f.order === active.id);
        const newIndex = questions.findIndex((f) => f.order === over.id);

        const newQuestions = arrayMove(questions, oldIndex, newIndex);
        const updated = newQuestions.map((field, i) => ({
            ...field,
            order: i + 1,
        }));

        setQuestions(updated);
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        setLoading(true);

        let response = null;
        let errorResponse = false;

        try {
            response = await dispatch(editEvaluation(formData)).unwrap();
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao alterar avaliação');
            errorResponse = true;
            setLoading(false);
        }

        if (errorResponse) return;

        if (response) {
            questions.map(async(question) => {

                if (errorResponse) return;

                if (!question.id) {
                    question.id_evaluation = response?.id;
                    question.created_at = new Date();
                    question.updated_at = new Date();

                    try {
                        await dispatch(addQuestion(question)).unwrap();
                    } catch (error: any) {
                        handleAlert(true,error?.message || 'Erro ao cadastrar questão da avaliação');
                        errorResponse = true;
                        setLoading(false);
                    }
                }
                else {
                    try {
                        await dispatch(editQuestion({...question, updated_at: new Date()})).unwrap();
                    } catch (error: any) {
                        handleAlert(true,error?.message || 'Erro ao editar questão da avaliação');
                        errorResponse = true;
                        setLoading(false);
                    }
                }
            });

            questionsDeleteds.map(async(question) => {

                if (errorResponse) return;

                if (question.id) {
                    try {
                        await dispatch(removeQuestion(question.id)).unwrap();
                    } catch (error: any) {
                        handleAlert(true,error?.message || 'Erro ao excluir questão da avaliação');
                        errorResponse = true;
                        setLoading(false);
                    }
                }
            })
        }

        if (errorResponse) return;

        setLoading(false);

        handleAlert(false,'Avaliação alterada com sucesso!');
    };

    const handleDelete = async() => {

        setLoading(true);

        let errorResponse = false;

        questions.map(async(question) => {

            if (errorResponse) return;

            if (question.id) {
                try {
                    await dispatch(removeQuestion(question.id)).unwrap();
                } catch (error: any) {
                    handleAlert(true,error?.message || 'Erro ao excluir questão da avaliação');
                    errorResponse = true;
                    setLoading(false);
                }
            }
        });

        questionsDeleteds.map(async(question) => {

            if (errorResponse) return;

            if (question.id) {
                try {
                    await dispatch(removeQuestion(question.id)).unwrap();
                } catch (error: any) {
                    handleAlert(true,error?.message || 'Erro ao excluir questão da avaliação');
                    errorResponse = true;
                    setLoading(false);
                }
            }
        })

        if (errorResponse) return;

        try {
            await dispatch(removeEvaluation(Number(id))).unwrap();
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao excluir avaliação');
            errorResponse = true;
            setLoading(false);
        }

        if (errorResponse) return;

        setLoading(false);

        router.push('/student/evaluation');
    };

    const handleAlert = (error: boolean, message: string) => {
        setAlertTitle(error ? "Erro" : "Sucesso");
        setAlertDesc(message)
        setInfoAlertOpen(true);
        setIsError(error);
    }

    const handleAlertConfirm = () => {
        setAlertTitle('Confirmação')
        setAlertDesc('Tem certeza que você deseja excluir esse registro?')
        setAlertOpen(true);
    }

    return (
        <>
            {loading || loadingQuestion
                ?<Loading/>
                :<div className="w-full h-full p-4">
                    <section className="min-h-16 flex flex-col gap-5">
                        <div className="text-left">
                            <h1 className="text-2xl">Alterar Avaliação</h1>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="font-bold">Estudante</label>
                                <div className="max-w-md">
                                    <StudentCombobox
                                        student={formData?.student}
                                        setStudent={(student: iStudent | undefined) => {
                                            setFormData((prev) => ({ ...prev, student }));
                                            setErrors((prev) => ({ ...prev, student: '' }));
                                        }}
                                        error={errors.student}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="font-bold">Data da entrada</label>
                                <div className="max-w-md">
                                    <Input
                                        id="entry_date"
                                        name="entry_date"
                                        type="date"
                                        value={formatDateForInput(formData?.entry_date)}
                                        onChange={handleInputChange}
                                        error={errors.entry_date} 
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
                                <label className="font-bold">Nome do professor</label>
                                <div className="max-w-md">
                                    <Input
                                        id="teacher_name"
                                        name="teacher_name"
                                        value={formData?.teacher_name}
                                        onChange={handleInputChange} 
                                        placeholder="Nome do professor"
                                        error={errors.teacher_name}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="font-bold">Nota da entrevista com os pais</label>
                                <div className="max-w-md">
                                    <Input
                                        id="interview_note"
                                        name="interview_note"
                                        value={formData?.interview_note}
                                        type="number"
                                        onChange={handleInputChange}
                                        error={errors.interview_note} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="font-bold">Nota avaliação</label>
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
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={questions.map((f) => f.order ? f.order : 0)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-4">
                                        {questions.map((question) => (
                                            <Question
                                                key={question.order}
                                                question={question}
                                                setValueQuestion={(value) => handleQuestionChange(question, value)}
                                                removeQuestion={() => handleRemoveQuestion(question)}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                            <div>
                                <label className="font-bold">Adicionar Questões</label>
                                <div className="flex flex-row flex-wrap gap-4 w-full">
                                    <Combobox
                                        items={[{value: "text", label: "Texto curto"}, {value: "textarea", label: "Texto grande"}, {value: "date", label: "Data"}, {value: "frequency", label: "Alternativas de frequência"}, {value: "quality", label: "Alternativas de qualidade"}]}
                                        value={formAdd?.type}
                                        setValue={(value) => handleFormAddChange("type", value)}
                                        placeholder="Selecione o tipo..."
                                        searchPlaceholder="Buscar tipo..."
                                        notFoundMessage="Nenhum tipo encontrado"
                                        error={errors.type}
                                        width="250px"
                                    />
                                    <div className="flex flex-row min-w-[250px] flex-auto gap-4 items-center">
                                        <Input
                                            id="title"
                                            name="title"
                                            value={formAdd?.title}
                                            onChange={(e) => handleFormAddChange("title", e.target.value)} 
                                            placeholder="Enunciado da questão"
                                            error={errors.title}
                                        />
                                        <div 
                                            className="rounded-full p-1 bg-green-700 hover:bg-green-600 text-white"
                                            title="Adicionar Questão"
                                            onClick={handleAddQuestion}
                                        >
                                            <Check size={14}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit">Salvar</Button>
                                <Button type="button" className="bg-red-500 hover:bg-red-400" onClick={handleAlertConfirm}>Excluir</Button>
                                <Button type="button" variant="secondary" onClick={() => router.push('/student/evaluation')}>
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
                        onClickBtn={() => {isError ? "" : router.push('/student/evaluation')}}
                    />
                </div>
            }
        </>
    );
}