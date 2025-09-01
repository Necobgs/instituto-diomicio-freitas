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
import { useState } from "react";

export default function RecoveryPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(true);

  // Função para validar o e-mail
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex simples para validar e-mail
    return emailRegex.test(email);
  };

  // Função para lidar com a recuperação de senha
  const handlePasswordRecovery = () => {
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

    // Simulação de envio do e-mail
    try {
      // Aqui você pode adicionar a lógica real para enviar o e-mail
      console.log(`Enviando e-mail de recuperação para: ${email}`);
      // Exemplo: fetch('/api/recovery', { method: 'POST', body: JSON.stringify({ email }) });
      setDialogMessage(
        `Um e-mail foi enviado para ${email} com instruções para redefinir sua senha.`
      );
      setIsSuccess(true);
      setIsDialogOpen(true);
    } catch (error) {
      setDialogMessage("Ocorreu um erro ao enviar o e-mail. Tente novamente.");
      setIsSuccess(false);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="bg-red-50 p-10 rounded shadow-2xl gap-5 flex items-center justify-start flex-col">
      <div className="flex justify-center items-center m-5">
        <Key />
      </div>
      <p className="text-sm text-center">
        Ao clicar em 'Recuperar a senha', um e-mail será <br />
        enviado com instruções para redefinir sua senha
      </p>
      <Input
        placeholder="E-mail"
        className="w-80"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button className="w-80" onClick={handlePasswordRecovery}>
        Recuperar a senha
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