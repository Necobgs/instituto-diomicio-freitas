"use client";

import CardEnterprise from "@/components/page/enterprise/CardEnterprise";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { initEnterprises, selectEnterpriseError, selectEnterpriseLoading, selectEnterprises } from "@/store/features/enterpriseSlice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function EnterprisePage(){

    const router = useRouter();
    const dispatch = useAppDispatch();
    const enterprises = useSelector(selectEnterprises);
    const [filteredEnterprises, setFilteredEnterprises] = useState(enterprises);
    const loading = useSelector(selectEnterpriseLoading);
    const error = useSelector(selectEnterpriseError);

    const defaultData = {
        name: "",
        cnpj: "",
        enabled: ""
    };
    const [formData, setFormData] = React.useState(defaultData);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        dispatch(initEnterprises());
    }, [dispatch]);

    useEffect(() => {
        setFilteredEnterprises(enterprises.filter((enterprise) => {
            return (
                enterprise.name.toLowerCase().trim().includes(formData.name.toLowerCase().trim()) &&
                enterprise.cnpj.toLowerCase().trim().startsWith(formData.cnpj.toLowerCase().trim())
            );
        }));
        setCurrentPage(1);
    }, [formData, enterprises]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEnterprises.slice(indexOfFirstItem, indexOfLastItem);

    const hasNextPage = indexOfLastItem < filteredEnterprises.length;
    const hasPreviousPage = currentPage > 1;

    return (
        <>
        {loading
        ?<Loading/>
        :<div className="w-full h-full p-4 flex flex-col">
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
                    <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
      {/*                   <Combobox 
                            items={[{value: "", label: "Todos"},{value: "true", label: "Ativos"},{value: "false", label: "Inativos"}]}
                            value={formData?.enabled} 
                            setValue={(value) => setFormData((prev) => ({ ...prev, enabled: value }))}
                        /> */}
                    </div>
                    <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                        <Button className="w-full">Buscar</Button>
                    </div>
                </div>
            </section>

            <Separator className="mt-6"/>
            
            <section className="mt-4 flex-auto">
                { filteredEnterprises != undefined || error
                ?<div>
                    {error ? error : `Quantidade de empresas encontradas: ${filteredEnterprises?.length}`}
                </div> 
                : ""
                }
                
                <div className="mt-5 grid gap-5 grid-cols-4">
                    {currentItems.map(entreprise =>
                        <CardEnterprise {...entreprise} key={entreprise.id}/>
                    )}
                </div>
            </section>

            <PaginationComponent
                cbNext={()=>{
                    if(hasNextPage) setCurrentPage(prev => prev + 1);
                }} 
                cbPrevius={()=>{
                    if(hasPreviousPage) setCurrentPage(prev => prev - 1);
                }}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                pageActivated={currentPage}
            />

            <button className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer" onClick={() => {router.push('/enterprise/create')}}>+</button>
        </div>
        }
        </>
    )
}
