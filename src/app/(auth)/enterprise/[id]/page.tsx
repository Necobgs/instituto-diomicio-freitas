"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { iEnterprise } from "@/types/enterprise";

export default function EnterpriseEditPage() {

    const router = useRouter();

    const [formData, setFormData] = useState<iEnterprise | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            console.log('Empresa Salva:', formData);
            alert('Empresa salva com sucesso! (Simulação)');
            router.push('/student');
        }
    };

    return (
        <div className="w-full h-full p-4">
            <section className="min-h-16 flex flex-col gap-5">
                <div className="text-left">
                    <h1 className="text-2xl">Editar Empresa</h1>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium">Nome</label>
                        <Input
                            id="name"
                            name="name"
                            value={formData?.name || ''}
                            onChange={handleInputChange}
                            placeholder="Nome da empresa"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="text-sm font-medium">Email</label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData?.phone || ''}
                            onChange={handleInputChange}
                            placeholder="Telefone da empresa"
                        />
                    </div>
                    <div>
                        <label htmlFor="cnpj" className="text-sm font-medium">CPF</label>
                        <Input
                            id="cnpj"
                            name="cnpj"
                            value={formData?.cnpj || ''}
                            onChange={handleInputChange}
                            placeholder="CNPJ da empresa"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="secondary" onClick={() => router.push('/enterprise')}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}