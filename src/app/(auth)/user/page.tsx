'use client'

import CardUser from "@/components/page/user-page/CardUser";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import MaskedInput from "@/components/ui/masked-input";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { initUsers, selectUserError, selectUserLoading, selectUsers, selectUserTotal } from "@/store/features/userSlice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


export default function UserPage(){
    
    const router = useRouter();
    const dispatch = useAppDispatch();
    const users = useSelector(selectUsers);
    const totalItems = useSelector(selectUserTotal);
    const loading = useSelector(selectUserLoading);
    const error = useSelector(selectUserError);

    const defaultData = {
        name: "",
        cpf: "",
        email: "",
        enabled: ""
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
            dispatch(initUsers({...formData, page: currentPage, limit: itemsPerPage }));
        }
        else {
            setCurrentPage(1);
        }
    }

    useEffect(() => {
        dispatch(initUsers({...formData, page: currentPage, limit: itemsPerPage }));
    }, [dispatch, currentPage]);

    const hasNextPage = currentPage * itemsPerPage < totalItems;
    const hasPreviousPage = currentPage > 1;

    return (
        <>
        {loading
        ? <Loading />
        :<div className="w-full h-full p-4 flex flex-col">
            <section className="min-h-16 flex flex-col gap-5">
                <div className="text-left">
                    <h1 className="text-2xl">Buscar usuários</h1>
                </div>
                <div className="flex flex-wrap items-center justify-start gap-4">
                    <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                        <Input                          
                            id="name"
                            name="name"
                            value={formData?.name || ''}
                            onChange={handleInputChange}
                            placeholder="Nome da usuário"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                        <MaskedInput
                            value={formData?.cpf || ''}
                            placeholder="CPF do usuário"
                            mask="000.000.000-00"
                            onChange={(val) => handleMaskedInputChange("cpf",val)}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                        <Input 
                            id="email"
                            name="email"
                            value={formData?.email || ''}
                            onChange={handleInputChange}
                            placeholder="Email do usuário" 
                        />
                    </div>
                    <div>
                        <Combobox
                            items={[{ value: "", label: "Todas as situações" }, { value: "true", label: "Ativos" }, { value: "false", label: "Inativos" }]}
                            value={formData?.enabled}
                            setValue={(value) => setFormData(prev => ({ ...prev, enabled: value }))}
                            placeholder="Todas as situações"
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
                { users != undefined || error
                ?<div>
                    {error ? error : `Quantidade de usuários encontrados: ${totalItems}`}
                </div>
                :""
                }
                
                <div className="mt-5 grid gap-5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] mb-5">
                    {users.map(user=>
                        <CardUser user={user} key={user.id} onClick={()=> router.push(`/user/${user.id}`)}/>
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

            <button className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer" onClick={() => {router.push('/user/create')}}>+</button>
        </div>
        }
        </>
    )
}