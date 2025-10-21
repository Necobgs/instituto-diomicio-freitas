"use client";

import CardEnterprise from "@/components/page/enterprise/CardEnterprise";
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
import { initEnterprises, selectEnterpriseError, selectEnterpriseLoading, selectEnterprises, selectEnterpriseTotal } from "@/store/features/enterpriseSlice";

export default function EnterprisePage() {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const enterprises = useSelector(selectEnterprises);
    const totalItems = useSelector(selectEnterpriseTotal);
    const loading = useSelector(selectEnterpriseLoading);
    const error = useSelector(selectEnterpriseError);

    const defaultData = {
        name: "",
        cnpj: "",
        enabled: ""
    };
    const [formData, setFormData] = useState(defaultData);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1); // resetar página ao mudar filtro
    };

    const handleSearch = () => {
        if (currentPage === 1)  {
            dispatch(initEnterprises({...formData, page: currentPage, limit: itemsPerPage }));
        }
        else {
            setCurrentPage(1);
        }
    }

    // Buscar empresas do servidor
    useEffect(() => {
        dispatch(initEnterprises({...formData, page: currentPage, limit: itemsPerPage }));
    }, [dispatch, currentPage]);

    const hasNextPage = currentPage * itemsPerPage < totalItems;
    const hasPreviousPage = currentPage > 1;

    return (
        <>
            {loading
                ? <Loading />
                : <div className="w-full h-full p-4 flex flex-col">
                    <section className="min-h-16 flex flex-col gap-5">
                        <div className="text-left">
                            <h1 className="text-2xl">Buscar empresa</h1>
                        </div>
                        <div className="flex flex-wrap items-center justify-start gap-4">
                            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData?.name || ''}
                                    onChange={handleInputChange}
                                    placeholder="Nome da empresa"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                                <Input
                                    id="cnpj"
                                    name="cnpj"
                                    value={formData?.cnpj || ''}
                                    onChange={handleInputChange}
                                    placeholder="CNPJ da empresa"
                                />
                            </div>
                            <div>
                                <Combobox
                                    items={[{ value: "", label: "Todos" }, { value: "true", label: "Ativos" }, { value: "false", label: "Inativos" }]}
                                    value={formData?.enabled}
                                    setValue={(value) => setFormData(prev => ({ ...prev, enabled: value }))}
                                    placeholder="Todos"
                                    searchPlaceholder="Buscar status..."
                                    notFoundMessage="Nenhum status encontrado."
                                />
                            </div>
                            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                                <Button className="w-full" onClick={handleSearch}>Buscar</Button>
                            </div>
                        </div>
                    </section>

                    <Separator className="mt-6" />

                    <section className="mt-4 flex-auto">
                        {enterprises.length > 0 || error
                            ? <div>
                                {error ? error : `Quantidade de empresas encontradas: ${totalItems}`}
                            </div>
                            : ""
                        }

                        <div className="mt-5 grid gap-5 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] overflow-auto mb-2">
                            {enterprises.map(entreprise =>
                                <CardEnterprise {...entreprise} key={entreprise.id} />
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

                    <button
                        className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer"
                        onClick={() => router.push('/enterprise/create')}
                    >+</button>
                </div>
            }
        </>
    );
}
