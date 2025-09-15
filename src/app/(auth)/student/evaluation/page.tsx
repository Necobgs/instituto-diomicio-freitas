"use client";

import Cardevaluation from "@/components/page/evaluation-page/CardEvaluation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import iEvaluation from "@/types/evaluation";
import { Separator } from "@radix-ui/react-separator";
import { useRouter } from "next/navigation";


const evaluations: iEvaluation[] = [
    { 
        id: 1,
        student: { id: 1, name: "Marcos", phone: "(48) 12345-6789", date_of_birth: new Date(1990, 11, 17), cpf: "123" },
        entry_date: new Date(2022, 10, 10),
        date: new Date(2024, 10, 10),
        teacher_name: "",
        interview_note: 50,
        note: 60,
        questions: [
            {id: 1, value: '2'},
            {id: 2, value: '1'},
            {id: 3, value: '1'},
            {id: 4, value: '3'},
            {id: 5, value: 'Não'},
            {id: 6, value: 'Sim'}
        ]
    },
    { 
        id: 2,
        student: { id: 1, name: "Marcos", phone: "(48) 12345-6789", date_of_birth: new Date(1990, 11, 17), cpf: "123" },
        entry_date: new Date(2023, 10, 10),
        date: new Date(2024, 8, 10),
        teacher_name: "",
        interview_note: 40,
        note: 30,
        questions: [
            {id: 1, value: '2'},
            {id: 2, value: '4'},
            {id: 3, value: '2'},
            {id: 4, value: '3'},
            {id: 5, value: 'teste'},
            {id: 6, value: 'Sim'}
        ]
    },
    { 
        id: 3,
        student: { id: 2, name: "Paulo", phone: "(48) 12345-6789", date_of_birth: new Date(2006, 6, 20), cpf: "456" },
        entry_date: new Date(2024, 10, 10),
        date: new Date(2025, 8, 8),
        teacher_name: "",
        interview_note: 50,
        note: 70,
        questions: [
            {id: 1, value: '3'},
            {id: 2, value: '4'},
            {id: 3, value: '2'},
            {id: 4, value: '3'},
            {id: 5, value: 'teste'},
            {id: 6, value: 'Sim'}
        ]
    }
];


export default function AvaliationPage(){

    const router = useRouter();

    return (
        <div className="w-full h-full p-4">
            <section className="min-h-16 flex flex-col gap-5">
                <div className="text-left">
                    <h1 className="text-2xl">Buscar avaliações</h1>
                </div>
                <div className="flex flex-wrap items-center justify-start gap-4">
                    <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                        <Input placeholder="Nome do aluno" />
                    </div>
                    <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                        <Button className="w-full">Buscar</Button>
                    </div>
                </div>
            </section>

            <Separator className="mt-6"/>
            
            <section className="mt-4">
                { evaluations != undefined &&
                <div>
                    Quantidade de avaliações encontradas: {evaluations.length}
                </div>
                }
                
                <div className="mt-5 grid gap-5 grid-cols-4">
                    {evaluations.map(evaluation=>
                        <Cardevaluation {...evaluation} key={evaluation.id}/>
                    )}
                </div>
            </section>

            <button className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer" onClick={() => {router.push('evaluation/create')}}>+</button>
        </div>
    )
}