'use client'

import { InfoAlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { getApp } from "@/store/features/appSlice";
import { getUserById, getUserPermissionsById, loginUser, selectCurrentUser, selectIdUser, selectUserLoading, setTokenFromStorage } from "@/store/features/userSlice";
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
  const idUser = useSelector(selectIdUser);
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectUserLoading);

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

  const validateToken = async () => {
      try {
          await dispatch(getApp()).unwrap();
          dispatch(setTokenFromStorage());
      } catch (error: any) {
          console.log('Erro',error?.message || 'Erro ao validar token, faça login novamente');
      }
  }

  const getUserPermissions = async (id: number) => {
      try {
          await dispatch(getUserPermissionsById(id)).unwrap();
      } catch (error: any) {
          handleAlert('Erro',error?.message || 'Erro ao buscar permissões do usuário');
      }
  };

  const getUser = async (id: number) => {
      try {
          await dispatch(getUserById(id)).unwrap();
          getUserPermissions(id);
      } catch (error: any) {
          handleAlert('Erro',error?.message || 'Erro ao buscar usuário');
      }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      validateToken();
    } 
  }, []);

  useEffect(() => {
    if (idUser) {
      getUser(idUser);
    }
  }, [router, idUser]);

  useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [router, currentUser]);

  return (
    <>
      {loading
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
              placeholder="Usuário" 
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