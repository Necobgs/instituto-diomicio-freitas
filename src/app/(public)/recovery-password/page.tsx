'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Key } from "lucide-react";
import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { isValidEmail } from "@/app/utils/validations";
import { useAppDispatch } from "@/store/hooks";
import { passwordChangeRequest } from "@/store/features/userSlice";

export default function RecoveryPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [alertTitle, setAlertTitle] = useState<string>("");
  const [alertDesc, setAlertDesc] = useState<string>("");
  const [infoAlertInfoOpen, setInfoAlertOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handlePasswordRecovery = async () => {
    if (!email) {
      handleAlert(true, "Por favor, insira um e-mail.");
      return;
    }

    if (!isValidEmail(email)) {
      handleAlert(true, "Por favor, insira um e-mail válido.");
      return;
    }

    try {
      const response = await dispatch(passwordChangeRequest(email)).unwrap();
      handleAlert(false, response?.message || `Um e-mail foi enviado para ${email} com instruções para redefinir sua senha.`);
    } catch (error: any) {
      handleAlert(true, error?.message || "Ocorreu um erro ao enviar o e-mail. Tente novamente.");
    }
  };

  const handleAlert = (error: boolean, message: string) => {
      setAlertTitle(error ? "Erro" : "Sucesso");
      setAlertDesc(message)
      setInfoAlertOpen(true);
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
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button className="w-[100%]" onClick={handlePasswordRecovery}>
        Recuperar a senha
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