'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key } from "lucide-react";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
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
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertDesc, setAlertDesc] = useState<string>("");
  const [infoAlertInfoOpen, setInfoAlertOpen] = useState<boolean>(false);

  const handleSubmit= async () => {
    if (!password) {
      handleAlert(true, "Por favor, insira uma senha.");
      return;
    }

    if (password.length < 6) {
      handleAlert(true, "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const response = await dispatch(passwordChange({ newPassword: password, token: token })).unwrap();
      handleAlert(false, response?.message || `Senha alterada com sucesso!`);
      router.push('/login');
    } catch (error: any) {
      handleAlert(true, error?.message || "Ocorreu um erro ao alterar a senha.");
    }
  };

  const handleAlert = (error: boolean, message: string) => {
      setAlertTitle(error ? "Erro" : "Sucesso");
      setAlertDesc(message)
      setInfoAlertOpen(true);
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

      <InfoAlertDialog
          message={alertDesc} 
          title={alertTitle} 
          open={infoAlertInfoOpen} 
          onOpenChange={setInfoAlertOpen}
      />
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