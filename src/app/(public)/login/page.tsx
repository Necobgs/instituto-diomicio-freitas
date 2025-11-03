'use client'

import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { loginUser, selectIsAuthenticated, fetchMe, validateTokenUser } from "@/store/features/userSlice";
import { useAppDispatch } from "@/store/hooks";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function LoginPage() {

  const defaultData = {
    email: "",
    password: ""
  };
  const [formData, setFormData] = useState(defaultData);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [infoAlertOpen, setInfoAlertOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault();

      try {
          await dispatch(loginUser(formData)).unwrap();
          handleAlert('Sucesso','Usuário logado com sucesso!');
      } catch (error: any) {
          handleAlert('Erro',error?.message || 'E-mail ou senha inválida');
      }
  };

  const handleAlert = (title: string, message: string) => {
      setAlertTitle(title)
      setAlertDesc(message)
      setInfoAlertOpen(true);
  }

  useEffect(() => {
    const validateAuth = async () => {
      try {
        await dispatch(validateTokenUser()).unwrap();
        router.push('/');
      } catch (error: any) {
      }
    }

    if (localStorage.getItem('token')) {
      validateAuth();
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [router, isAuthenticated]);

  return (
    <>
      {isAuthenticated
        ?<Loading/>
        :<div className="min-h-8/12 bg-red-50 p-10 rounded shadow-2xl gap-5 flex items-center justify-start flex-col">
            <div className="flex justify-center items-center m-5">
              <User />
            </div>
            <Input                                     
              id="email"
              name="email"
              value={formData?.email || ''}
              onChange={handleInputChange} 
              placeholder="Email" 
              className="w-80"
            />
            <Input 
              id="password"
              name="password"
              value={formData?.password || ''}
              onChange={handleInputChange} 
              placeholder="Senha" 
              className="w-80"
              type="password"
            />
            <a href="/recovery-password" className="ml-1">Esqueci a minha senha</a>
            <Button className="w-80 mt-auto" onClick={handleSubmit}>Entrar</Button>

            <InfoAlertDialog
                message={alertDesc} 
                title={alertTitle} 
                open={infoAlertOpen} 
                onOpenChange={setInfoAlertOpen}
            />
          </div>
        }
      </>
  );
}