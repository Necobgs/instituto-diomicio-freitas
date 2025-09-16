"use client";

import CardStudent from "@/components/page/student-page/CardStudent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function StudentPage(){

    const router = useRouter();
    
    const students = [
        {
            id:1,
            name:'Marcos',
            phone: "(48) 12345-6789",
            date_of_birth: new Date(1990, 11, 17),
            cpf: '123',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: 2,
            name:'Paulo',
            phone: "(48) 12345-6789",
            date_of_birth: new Date(2006, 6, 20),
            cpf: '123',
            created_at: new Date(),
            updated_at: new Date(),
        },
    ];
    
    return (
        
        <div className="w-full h-full p-4 flex flex-col">
            <section className="min-h-16 flex flex-col gap-5">
        <div className="text-left">
          <h1 className="text-2xl">Buscar estudantes</h1>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-4">
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="Nome do aluno" />
          </div>
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="CPF do aluno"/>
          </div>
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Button className="w-full">Buscar</Button>
          </div>
        </div>
      </section>

            <Separator className="mt-6"/>
            
            <section className="mt-4 flex-auto">
                { students != undefined &&
                <div>
                    Quantidade de alunos encontrados: {students.length}
                </div>
                }
                
                <div className="mt-5 grid gap-5 grid-cols-4">
                    {students.map(student=>
                        <CardStudent {...student} key={student.id}/>
                    )}
                </div>
            </section>

            <PaginationComponent
                cbNext={()=>{console.log('Próxima página')}} 
                cbPrevius={()=>{console.log('Página anterior')}}
                hasNextPage={true}
                hasPreviousPage={true}
                pageActivated={3}
            />

            <button className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer" onClick={() => {router.push('/student/create')}}>+</button>
        </div>
    )
}