"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { iStudent } from "@/types/student";

export default function StudentEditPage() {

    const students: iStudent[] = [
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
    
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const enterprise: iStudent | undefined = students.find(enterprise => enterprise.id.toString() === id);
    
    const defaultData: iStudent = {
        id: 0,
        name: "",
        phone: "",
        date_of_birth: null,
        cpf: "",
        created_at: new Date(),
        updated_at: new Date(),
    };

    const [formData, setFormData] = useState<iStudent>(enterprise ? enterprise : defaultData);

    if (!enterprise) {
        return (
            <div className="w-full h-full p-4 flex justify-center items-center text-center">
                <p>Estudante não encontrado :(</p>
            </div>
        );
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "created_at" || name === "updated_at" || name == "date_of_birth") {
            setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            console.log('Estudante alterado:', formData);
            alert('Estudante alterado com sucesso! (Simulação)');
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
                        <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData?.phone || ''}
                            onChange={handleInputChange}
                            placeholder="Telefone do estudante"
                        />
                    </div>
                    <div>
                        <label htmlFor="date_of_birth" className="text-sm font-medium">Data de nascimento</label>
                        <Input
                            id="date_of_birth"
                            name="date_of_birth"
                            value={formData?.date_of_birth ? formData?.date_of_birth.toISOString().split("T")[0] : ""}
                            onChange={handleInputChange}
                            type="date"
                        />
                    </div>
                    <div>
                        <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
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
                        <Button className="bg-red-500">Excluir</Button>
                        <Button type="button" variant="secondary" onClick={() => router.push('/student')}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
}