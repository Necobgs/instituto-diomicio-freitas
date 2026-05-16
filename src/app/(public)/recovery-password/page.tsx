'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Key } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { isValidEmail } from "@/app/utils/validations";
import { useAppDispatch } from "@/store/hooks";
import { passwordChangeRequest } from "@/store/features/userSlice";

export default function RecoveryPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  // Função para lidar com a recuperação de senha
  const handlePasswordRecovery = async () => {
    // Validação: campo vazio
    if (!email) {
      setDialogMessage("Por favor, insira um e-mail.");
      setIsSuccess(false);
      setIsDialogOpen(true);
      return;
    }

    // Validação: e-mail válido
    if (!isValidEmail(email)) {
      setDialogMessage("Por favor, insira um e-mail válido.");
      setIsSuccess(false);
      setIsDialogOpen(true);
      return;
    }

    try {
      const response = await dispatch(passwordChangeRequest(email)).unwrap();
      setDialogMessage(response?.message || `Um e-mail foi enviado para ${email} com instruções para redefinir sua senha.`);
      setIsSuccess(true);
      setIsDialogOpen(true);
    } catch (error: any) {
      setDialogMessage(error?.message || "Ocorreu um erro ao enviar o e-mail. Tente novamente.");
      setIsSuccess(false);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="w-md max-w-[95%] bg-red-50 p-10 rounded-2xl shadow-2xl gap-5 flex items-center justify-start flex-col">
        <a className="flex items-center justify-start w-[100%] min-w-full gap-2" href="/login">
            <ArrowLeft size={20}/>
            <span className="text-sm">Voltar</span>
        </a>
      <div className="flex justify-center items-center m-5">
        <Key />
      </div>
      <p className="w-[100%] text-sm text-left">
        Ao clicar em 'Recuperar a senha', um e-mail será enviado com instruções para redefinir sua senha.
      </p>
      <Input
        placeholder="E-mail"
        className="w-[100%]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button className="w-[100%]" onClick={handlePasswordRecovery}>
        Recuperar a senha
      </Button>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left">
              {isSuccess ? "Sucesso!" : "Erro"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {dialogMessage}
            </AlertDialogDescription>
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