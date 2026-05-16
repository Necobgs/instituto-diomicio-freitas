'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Suspense, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { passwordChange } from "@/store/features/userSlice";
import { useRouter, useSearchParams } from "next/navigation";

function RecoveryPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();  
  const dispatch = useAppDispatch();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(true);

  const handleSubmit= async () => {
    if (!password) {
      setDialogMessage("Por favor, insira uma senha.");
      setIsSuccess(false);
      setIsDialogOpen(true);
      return;
    }

    if (password.length < 6) {
      setDialogMessage("A senha deve ter pelo menos 6 caracteres.");
      setIsSuccess(false);
      setIsDialogOpen(true);
      return;
    }

    try {
      const response = await dispatch(passwordChange({ newPassword: password, token: token })).unwrap();
      setDialogMessage(response?.message || `Senha alterada com sucesso!`);
      setIsSuccess(true);
      setIsDialogOpen(true);
      router.push('/login');
    } catch (error: any) {
      setDialogMessage(error?.message || "Ocorreu um erro ao alterar a senha.");
      setIsSuccess(false);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="w-md max-w-[95%] bg-red-50 p-10 rounded-2xl shadow-2xl gap-5 flex items-center justify-start flex-col">
      <div className="flex justify-center items-center m-5">
        <Key />
      </div>
      <p className="w-[100%] text-sm text-left">
        Ao clicar em 'Atualizar a senha', a senha  referente a este e-mail será alterada para a nova senha digitada.
      </p>
      <Input
        placeholder="Digite a nova senha"
        className="w-[100%]"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button className="w-[100%]" onClick={handleSubmit}>
        Atualizar a senha
      </Button>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isSuccess ? "Sucesso!" : "Erro"}
            </AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDialogOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function RecoveryPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RecoveryPasswordPageContent />
    </Suspense>
  );
}