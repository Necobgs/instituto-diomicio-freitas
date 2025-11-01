"use client";

import CardEvaluation from "@/components/page/evaluation-page/CardEvaluation";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import MaskedInput from "@/components/ui/masked-input";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { initEvaluations, selectEvaluationError, selectEvaluationLoading, selectEvaluations, selectEvaluationTotal } from "@/store/features/evaluationSlice";
import { useAppDispatch } from "@/store/hooks";
import { iParamsEvaluation } from "@/types/evaluation";
import { iStudent } from "@/types/student";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function EvaluationPage(){

    const router = useRouter();
    const dispatch = useAppDispatch();
    const evaluations = useSelector(selectEvaluations);
    const totalItems = useSelector(selectEvaluationTotal);
    const loading = useSelector(selectEvaluationLoading);
    const error = useSelector(selectEvaluationError);

    const defaultData: iParamsEvaluation = {
        student: undefined,
        entry_date: "",
        date: "",
        teacher_name: "",
    };
    const [formData, setFormData] = useState(defaultData);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMaskedInputChange = (name: string, value: string) => {
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

    const hasNextPage = currentPage * itemsPerPage < totalItems;
    const hasPreviousPage = currentPage > 1;
    
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
                                setStudent={(student: iStudent | undefined) =>
                                setFormData((prev) => ({ ...prev, student }))
                            }
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <Input 
                                id="teacher_name"
                                name="teacher_name"
                                value={formData?.teacher_name || ''}
                                onChange={handleInputChange}
                                placeholder="Nome do professor" 
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                        <Input 
                            id="entry_date"
                            name="entry_date"
                            value={formData?.entry_date}
                            onChange={handleInputChange}
                            placeholder="Data da entrada" 
                            type="date" 
                        />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                        <Input
                            id="date"
                            name="date"
                            value={formData?.date}
                            onChange={handleInputChange}
                            placeholder="Data da avaliação"
                            type="date" 
                        />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <Button className="w-full" onClick={handleSearch}>Buscar</Button>
                        </div>
                    </div>
                </section>

                <Separator className="mt-6"/>
                
                <section className="mt-4 flex-auto">
                    { evaluations != undefined || error
                    ?<div>
                        {error ? error: `Quantidade de avaliações encontradas: ${totalItems}`}
                    </div>
                    : ""
                    }
                    
                    <div className="mt-5 grid gap-5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] mb-5">
                        {evaluations.map(evaluation=>
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