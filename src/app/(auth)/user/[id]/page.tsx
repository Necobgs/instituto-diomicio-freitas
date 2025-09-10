'use client'

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export interface iUser {
    id: number;
    name: string;
    email: string;
    cpf: string;
}

export default function UserEditPage() {
    const users: iUser[] = [
        { id: 1, name: 'Emanuel', email: 'emanuel@gmail.com', cpf: '123' },
        { id: 2, name: 'Lucas', email: 'lucas@gmail.com', cpf: '321' },
        { id: 3, name: 'usuario', email: 'usuario@gmail.com', cpf: '1234' },
        { id: 4, name: 'outro usuário', email: 'outrousuario@gmail.com', cpf: '4312' },
        { id: 5, name: 'alessandro', email: 'alessandro@gmail.com', cpf: '12345' },
        { id: 6, name: 'margot', email: 'margot@gmail.com', cpf: '54312' }
    ];

    const params = useParams();
    const router = useRouter();
    const { id } = params;
    const user = users.find(user => user.id.toString() === id);

    // Estado para os campos do formulário
    const [formData, setFormData] = useState<iUser | null>(user || null);

    if (!user) {
        return (
            <div className="w-full h-full p-4 flex justify-center items-center text-center">
                <p>Usuário não encontrado :(</p>
            </div>
        );
    }

    // Função para atualizar o estado ao alterar os inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    // Função para simular o envio do formulário
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            console.log('Usuário atualizado:', formData);
            alert('Usuário atualizado com sucesso! (Simulação)');
            router.push('/users'); // Redireciona para a lista de usuários (ajuste o caminho conforme necessário)
        }
    };

    return (
        <div className="w-full h-full p-4">
            <section className="min-h-16 flex flex-col gap-5">
                <div className="text-left">
                    <h1 className="text-2xl">Editar Usuário</h1>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium">Nome</label>
                        <Input
                            id="name"
                            name="name"
                            value={formData?.name || ''}
                            onChange={handleInputChange}
                            placeholder="Nome do usuário"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData?.email || ''}
                            onChange={handleInputChange}
                            placeholder="Email do usuário"
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
                        <Input
                            id="cpf"
                            name="cpf"
                            value={formData?.cpf || ''}
                            onChange={handleInputChange}
                            placeholder="CPF do usuário"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button type="submit">Salvar</Button>
                        <Button type="button" variant="secondary" onClick={() => router.back()}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}