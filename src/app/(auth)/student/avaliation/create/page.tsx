"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { iQuestion } from "@/types/question";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EnterpriseCreatePage() {

    const router = useRouter();

    const questions: iQuestion[] = [
        {
            id: 1,
            text: "Atende as regras.",
            discursive: false,
            value: "1",
        },
        {
            id: 2,
            text: "Socializa com o grupo.",
            discursive: false,
            value: "2",
        },
        {
            id: 3,
            text: "Isola-se do grupo.",
            discursive: false,
            value: "4",
        },
        {
            id: 4,
            text: "Possui tolerância a frustração.",
            discursive: false,
            value: "3",
        },
        {
            id: 5,
            text: "Em sua opinião o usuário tem perfil para esta instituição? Por quê?",
            discursive: true,
            value: "Teste testando",
        },
        {
            id: 6,
            text: "Em que situações demonstra irritações?",
            discursive: true,
            value: "Teste testando2",
        },
    ];

    const [formData, setFormData] = useState<{ [id: number]: string }>({});

    const handleInputChange = (id: number, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(e)
    };

    return (
        <div className="w-full h-full p-4">
            <section className="min-h-16 flex flex-col gap-5">
                <div className="text-left">
                    <h1 className="text-2xl">Gerar Avaliação</h1>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-10 w-full">
                    {questions.map((obj, idx) => {
                        return (
                            <div key={`question_${idx}`} className="flex flex-col gap-3 w-full">
                                <label className="font-bold">{`${idx + 1} - ${obj.text}`}</label>
                                {obj.discursive 
                                ?<Textarea 
                                    value={formData[obj.id] ?? obj.value}
                                    onChange={(e) => handleInputChange(obj.id, e.target.value)}/>
                                :<div className="flex flex-row gap-5">
                                    <div className="flex-1">
                                        <label>Sim</label>
                                    </div>
                                    <div className="flex-1">
                                        <label>Não</label>
                                    </div>
                                    <div className="flex-3">
                                        <label>Maioria das vezes</label>
                                    </div>
                                    <div className="flex-2">
                                        <label>Raras vezes</label>
                                    </div>
                                </div>
                                }
                            </div>
                        );
                    })}
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="secondary" onClick={() => router.push('/student/avaliation')}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}