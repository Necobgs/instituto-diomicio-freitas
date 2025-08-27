'use client'

import CardUser from "@/components/page/user-page/CardUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";

export default function UserPage(){
    
    const users = [
        {
            id:1,
            name:'Emanuel',
            email:'emanuel@gmail.com',
            cpf:'123'
        },
        {
            id:2,
            name:'Lucas',
            email:'lucas@gmail.com',
            cpf:'321'
        },
        {
            id:3,
            name:'usuario',
            email:'usuario@gmail.com',
            cpf:'1234'
        },
        {
            id:4,
            name:'outro usuário',
            email:'outrousuario@gmail.com',
            cpf:'4312'
        },
        {
            id:5,
            name:'alessandro',
            email:'alessandro@gmail.com',
            cpf:'12345'
        },
        {
            id:6,
            name:'margot',
            email:'margot@gmail.com',
            cpf:'54312'
        }
    ]
    
    return (
        <div className="w-full h-full p-4 flex flex-col justify-between">
            <section className="min-h-16 flex flex-col gap-5">
                <div className="text-left">
                    <h1 className="text-2xl">Buscar usuário</h1>
                </div>
                <div className="flex items-center justify-start gap-5">
                    <Input placeholder="Nome do usuário"></Input>
                    <Input placeholder="Email do usuário"></Input>
                    <Input placeholder="CPF do usuário"></Input>
                    <Button>Buscar</Button>
                </div>    
            </section>

            <Separator className="mt-6"/>
            
            <section className="mt-4">
                { users != undefined &&
                <div>
                    Quantidade de usuários encontrados: {users.length}
                </div>
                }
                
                <div className="mt-5 grid gap-5 grid-cols-4">
                    {users.map(user=>
                        <CardUser {...user} key={user.id}/>
                    )}
                </div>
            </section>
             <PaginationComponent 
                cbNext={()=>{console.log('Próxima página')}} 
                cbPrevius={()=>{console.log('Página anterior')}}
                hasNextPage={true}
                hasPreviousPage={true}
                pageActivated={3}/>
        </div>
    )
}