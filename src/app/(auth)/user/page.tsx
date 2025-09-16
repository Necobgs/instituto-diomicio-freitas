'use client'

import CardUser from "@/components/page/user-page/CardUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { iUser } from "@/types/user";
import { useRouter } from "next/navigation";


export default function UserPage(){
    
    const users: iUser[] = [
        {
            id:1,
            name:'Emanuel',
            email:'emanuel@gmail.com',
            cpf:'123',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id:2,
            name:'Lucas',
            email:'lucas@gmail.com',
            cpf:'321',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id:3,
            name:'usuario',
            email:'usuario@gmail.com',
            cpf:'1234',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id:4,
            name:'outro usuário',
            email:'outrousuario@gmail.com',
            cpf:'4312',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id:5,
            name:'alessandro',
            email:'alessandro@gmail.com',
            cpf:'12345',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id:6,
            name:'margot',
            email:'margot@gmail.com',
            cpf:'54312',
            created_at: new Date(),
            updated_at: new Date(),
        }
    ]
    
    const router = useRouter()

    return (
        <div className="w-full h-full p-4 flex flex-col">
            <section className="min-h-16 flex flex-col gap-5">
        <div className="text-left">
          <h1 className="text-2xl">Buscar usuários</h1>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-4">
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="Nome do usuário" />
          </div>
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="CPF do usuário"/>
          </div>
          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Input placeholder="Email do usuário" />
          </div>

          <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
            <Button className="w-full">Buscar</Button>
          </div>
        </div>
      </section>

            <Separator className="mt-6"/>
            
            <section className="mt-4 flex-auto">
                { users != undefined &&
                <div>
                    Quantidade de usuários encontrados: {users.length}
                </div>
                }
                
                <div className="mt-5 grid gap-5 grid-cols-4">
                    {users.map(user=>
                        <CardUser user={user} key={user.id} onClick={()=> router.push(`/user/${user.id}`)}/>
                    )}
                </div>
            </section>
             <PaginationComponent 
                cbNext={()=>{console.log('Próxima página')}} 
                cbPrevius={()=>{console.log('Página anterior')}}
                hasNextPage={true}
                hasPreviousPage={true}
                pageActivated={3}/>

            <button className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer" onClick={() => {router.push('/user/create')}}>+</button>
        </div>
    )
}