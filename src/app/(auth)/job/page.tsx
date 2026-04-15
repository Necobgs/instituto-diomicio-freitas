"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { initJobs, selectJobError, selectJobLoading, selectJobs, selectJobCount, selectJobHasPreviousPage, selectJobHasNextPage } from "@/store/features/jobSlice";
import { defaultFilterJob } from "@/types/job";
import CardJob from "@/components/page/job/CardJob";

export default function JobPage() {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const jobs = useSelector(selectJobs);
    const countItems = useSelector(selectJobCount);
    const loading = useSelector(selectJobLoading);
    const error = useSelector(selectJobError);
    const hasNextPage = useSelector(selectJobHasNextPage);
    const hasPreviousPage = useSelector(selectJobHasPreviousPage);

    const [formData, setFormData] = useState(defaultFilterJob);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        if (currentPage === 1)  {
            dispatch(initJobs({...formData, page: currentPage, limit: itemsPerPage }));
        }
        else {
            setCurrentPage(1);
        }
    }

    useEffect(() => {
        dispatch(initJobs({...formData, page: currentPage, limit: itemsPerPage }));
    }, [dispatch, currentPage]);

    return (
        <>
            {loading
                ? <Loading />
                : <div className="w-full h-full p-4 flex flex-col">
                    <section className="min-h-16 flex flex-col gap-5">
                        <div className="text-left">
                            <h1 className="text-2xl">Buscar cargos</h1>
                        </div>
                        <div className="flex flex-wrap items-center justify-start gap-4">
                            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData?.name || ''}
                                    onChange={handleInputChange}
                                    placeholder="Nome da cargo"
                                />
                            </div>
                            <div>
                                <Combobox
                                    items={[{ value: "all", label: "Ambos"}, { value: "true", label: "Ativos" }, { value: "false", label: "Inativos" }]}
                                    value={formData?.enabled}
                                    setValue={(value) => setFormData(prev => ({ ...prev, enabled: value }))}
                                    isSearchable={false}
                                />
                            </div>
                            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                                <Button className="w-full" onClick={handleSearch}>Buscar</Button>
                            </div>
                        </div>
                    </section>

                    <Separator className="mt-6" />

                    <section className="mt-4 flex-auto">
                        <div>
                            {error ? error : `Quantidade de cargos encontradas: ${countItems}`}
                        </div>

                        <div className="mt-5 grid gap-5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] mb-5">
                            {
                                jobs?.[0] &&
                                jobs?.map(job =>
                                    <CardJob {...job} key={job.id} />
                                )
                            }
                        </div>
                    </section>

                    <PaginationComponent
                        cbNext={() => hasNextPage && setCurrentPage(prev => prev + 1)}
                        cbPrevius={() => hasPreviousPage && setCurrentPage(prev => prev - 1)}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        pageActivated={currentPage}
                    />

                    <button
                        className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer"
                        onClick={() => router.push('/job/create')}
                    >+</button>
                </div>
            }
        </>
    );
}
