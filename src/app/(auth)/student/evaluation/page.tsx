"use client";

import CardEvaluation from "@/components/page/evaluation-page/CardEvaluation";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { UserCombobox } from "@/components/ui/combo-box-user";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { initEvaluations, selectEvaluationCount, selectEvaluationError, selectEvaluationHasNextPage, selectEvaluationHasPreviousPage, selectEvaluationLoading, selectEvaluations } from "@/store/features/evaluationSlice";
import { useAppDispatch } from "@/store/hooks";
import { defaultFilterEvaluation } from "@/types/evaluation";
import { iStudentForm } from "@/types/student";
import { iUserForm } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function EvaluationPage(){

    const router = useRouter();
    const dispatch = useAppDispatch();
    const evaluations = useSelector(selectEvaluations);
    const countItems = useSelector(selectEvaluationCount);
    const loading = useSelector(selectEvaluationLoading);
    const error = useSelector(selectEvaluationError);
    const hasNextPage = useSelector(selectEvaluationHasNextPage);
    const hasPreviousPage = useSelector(selectEvaluationHasPreviousPage);

    const [formData, setFormData] = useState(defaultFilterEvaluation);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        if (currentPage === 1)  {
            dispatch(initEvaluations({...formData, page: currentPage, limit: itemsPerPage }));
        }
        else {
            setCurrentPage(1);
        }
    }

    useEffect(() => {
        dispatch(initEvaluations({...formData, page: currentPage, limit: itemsPerPage }));
    }, [dispatch, currentPage]);
    
    return (
        <>
            {loading
            ?<Loading/>
            :<div className="w-full h-full p-4 flex flex-col">
                <section className="min-h-16 flex flex-col gap-5">
                    <div className="text-left">
                    <h1 className="text-2xl">Buscar avaliações</h1>
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-4">
                        <div>
                            <StudentCombobox
                                student={formData.student}
                                setStudent={(student: iStudentForm | undefined) =>
                                    setFormData((prev) => ({ ...prev, student }))
                                }
                            />
                        </div>
                        <div>
                            <UserCombobox
                                user={formData.user}
                                setUser={(user: iUserForm | undefined) =>
                                    setFormData((prev) => ({ ...prev, user }))
                                }
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <Input 
                                id="dateIni"
                                name="dateIni"
                                value={formData?.dateIni}
                                onChange={handleInputChange}
                                placeholder="Data da avaliação início" 
                                type="date" 
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <Input
                                id="dateEnd"
                                name="dateEnd"
                                value={formData?.dateEnd}
                                onChange={handleInputChange}
                                placeholder="Data da avaliação fim"
                                type="date" 
                            />
                        </div>
                        <div>
                            <Combobox
                                items={[{ value: "all", label: "Ambos"}, { value: "true", label: "Ativos" }, { value: "false", label: "Inativos" }]}
                                value={formData?.enabled}
                                setValue={(value) => setFormData(prev => ({ ...prev, enabled: value }))}
                                placeholder="Selecione a situação..."
                                searchPlaceholder="Buscar situação..."
                                notFoundMessage="Nenhuma situação encontrada"
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <Button className="w-full" onClick={handleSearch}>Buscar</Button>
                        </div>
                    </div>
                </section>

                <Separator className="mt-6"/>
                
                <section className="mt-4 flex-auto">
                    <div>
                        {error ? error: `Quantidade de avaliações encontradas: ${countItems}`}
                    </div>
                    
                    <div className="mt-5 grid gap-5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] mb-5">
                        {evaluations?.[0] && evaluations.map(evaluation=>
                            <CardEvaluation {...evaluation} key={evaluation.id}/>
                        )}
                    </div>
                </section>

                <PaginationComponent
                    cbNext={() => hasNextPage && setCurrentPage(prev => prev + 1)}
                    cbPrevius={() => hasPreviousPage && setCurrentPage(prev => prev - 1)}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    pageActivated={currentPage}
                />

                <button className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer" onClick={() => {router.push('/student/evaluation/create')}}>+</button>
            </div>}
        </>
    )
}