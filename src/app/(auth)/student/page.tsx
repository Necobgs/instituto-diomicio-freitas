"use client";

import CardStudent from "@/components/page/student-page/CardStudent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
            cpf: '123'
        },
        {
            id: 2,
            name:'Paulo',
            phone: "(48) 12345-6789",
            date_of_birth: new Date(2006, 6, 20),
            cpf: '123'
        },
    ];
    
    return (
        
        <div className="w-full h-full p-4">
            <section className="min-h-16 flex flex-col gap-5">
                <div className="text-left">
                    <h1 className="text-2xl">Buscar aluno</h1>
                </div>
                <div className="flex items-center justify-start gap-5">
                    <Input placeholder="Nome do aluno"></Input>
                    <Input placeholder="CPF do aluno"></Input>
                    <Button>Buscar</Button>
                </div>    
            </section>

            <Separator className="mt-6"/>
            
            <section className="mt-4">
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

            <button className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg" onClick={() => {router.push('/student/create')}}>+</button>
        </div>
    )
}