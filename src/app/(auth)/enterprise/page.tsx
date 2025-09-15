"use client";

import CardEnterprise from "@/components/page/enterprise/CardEnterprise";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function EnterprisePage(){

    const router = useRouter();
    
    const enterprises = [
        {
            id: 1,
            name:'Empresa 1',
            phone: "(48) 12345-6789",
            cnpj: '123',
        },
        {
            id: 2,
            name:'Empresa 2',
            phone: "(48) 12345-6789",
            cnpj: '123'
        },
    ];
    
    return (
        
        <div className="w-full h-full p-4">
            <section className="min-h-16 flex flex-col gap-5">
        <div className="text-left">
          <h1 className="text-2xl">Buscar empresa</h1>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-4">
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="Nome da empresa" />
          </div>
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="CNPJ da empresa"/>
          </div>
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Button className="w-full">Buscar</Button>
          </div>
        </div>
      </section>

            <Separator className="mt-6"/>
            
            <section className="mt-4">
                { enterprises != undefined &&
                <div>
                    Quantidade de alunos encontrados: {enterprises.length}
                </div>
                }
                
                <div className="mt-5 grid gap-5 grid-cols-4">
                    {enterprises.map(entreprise=>
                        <CardEnterprise {...entreprise} key={entreprise.id}/>
                    )}
                </div>
            </section>

            <button className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer" onClick={() => {router.push('/enterprise/create')}}>+</button>
        </div>
    )
}