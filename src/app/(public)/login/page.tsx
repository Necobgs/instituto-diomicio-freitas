import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";


export default function LoginPage() {

  return (
    <div className="min-h-8/12 bg-red-50 p-10 rounded shadow-2xl gap-5 flex items-center justify-start flex-col">
        <div className="flex justify-center items-center m-5">
          <User></User>
        </div>
        <Input placeholder="Email" className="w-80"></Input>
        <Input placeholder="Senha" className="w-80"></Input>
        <a href="/recovery-password" className="ml-1">Esqueci a minha senha</a>
        <Button className="w-80 mt-auto">Entrar</Button>
      </div>
  );
}