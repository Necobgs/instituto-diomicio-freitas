"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { iStudent } from "@/types/student";

export default function UserEditPage() {

    const router = useRouter();

    const [formData, setFormData] = useState<iStudent | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            console.log('Estudante Salvo:', formData);
            alert('Estudante salvo com sucesso! (Simulação)');
            router.push('/student');
        }
    };

    return (
        <div className="w-full h-full p-4">
            <section className="min-h-16 flex flex-col gap-5">
                <div className="text-left">
                    <h1 className="text-2xl">Editar Estudante</h1>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium">Nome</label>
                        <Input
                            id="name"
                            name="name"
                            value={formData?.name || ''}
                            onChange={handleInputChange}
                            placeholder="Nome do estudante"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="text-sm font-medium">Email</label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData?.phone || ''}
                            onChange={handleInputChange}
                            placeholder="Telefone do estudante"
                        />
                    </div>
                    <div>
                        <label htmlFor="date_of_birth" className="text-sm font-medium">CPF</label>
                        <Input
                            id="date_of_birth"
                            name="date_of_birth"
                            value={formData?.cpf || ''}
                            onChange={handleInputChange}
                            placeholder="Data de nascimento do estudante"
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf" className="text-sm font-medium">Email</label>
                        <Input
                            id="cpf"
                            name="cpf"
                            value={formData?.cpf || ''}
                            onChange={handleInputChange}
                            placeholder="CPF do estudante"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="secondary" onClick={() => router.push('/student')}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}