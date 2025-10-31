"use client";

import { DefaultAlertDialog, InfoAlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { EnterpriseCombobox } from "@/components/ui/combo-box-enterprise";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import MaskedInput from "@/components/ui/masked-input";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/table";
import { selectEnterpriseError } from "@/store/features/enterpriseSlice";
import { initMonitorings, removeMonitoring, selectMonitoringLoading, selectMonitorings, selectMonitoringTotal } from "@/store/features/monitoringSlice";
import { useAppDispatch } from "@/store/hooks";
import { iEnterprise } from "@/types/enterprise";
import { iParamsMonitoring, monitoringColumns } from "@/types/monitoring";
import { iStudent } from "@/types/student";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MonitoringPage() {
  const router = useRouter();
  const [alertTitle,setAlertTitle] = useState('');
  const [alertDesc,setAlertDesc] = useState('');
  const [alertOpen,setAlertOpen] = useState(false);
  const [infoAlertOpen,setInfoAlertOpen] = useState(false);
  const [idToDelete,setIdToDelete] = useState(0);
  const monitorings = useSelector(selectMonitorings);
  const totalItems = useSelector(selectMonitoringTotal);
  const loading = useSelector(selectMonitoringLoading);
  const error = useSelector(selectEnterpriseError);
  const dispatch = useAppDispatch();

  const defaultData: iParamsMonitoring = {
      student: undefined,
      admission_date: "",
      enterprise: undefined,
      job_title: "",
      hr_contact: "",
      hr_resposible: "",
      termination_date_ieedf: ""
  };
  const [formData, setFormData] = useState(defaultData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaskedInputChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleAlertConfirm = (id: number) => {
    setIdToDelete(id);
    setAlertTitle('Confirmação')
    setAlertDesc('Tem certeza que você deseja excluir esse registro?')
    setAlertOpen(true);
  }

  const handleEdit = (id: number) => {
    router.push(`/student/monitoring/${id}`);
  }

  const handleDelete = async() => {

    try {
        await dispatch(removeMonitoring(idToDelete)).unwrap();
    } catch (error: any) {
        handleAlert(true,error?.message || 'Erro ao excluir acompanhamento');
    }
    
    setIdToDelete(0);
  };

  const handleAlert = (error: boolean, message: string) => {
      setAlertTitle(error ? "Erro" : "Sucesso");
      setAlertDesc(message)
      setInfoAlertOpen(true);
  }
  const handleSearch = () => {
      if (currentPage === 1)  {
          dispatch(initMonitorings({...formData, page: currentPage, limit: itemsPerPage }));
      }
      else {
          setCurrentPage(1);
      }
  }

  useEffect(() => {
      dispatch(initMonitorings({...formData, page: currentPage, limit: itemsPerPage }));
  }, [dispatch, currentPage]);
  

  const hasNextPage = currentPage * itemsPerPage < totalItems;
  const hasPreviousPage = currentPage > 1;

  return (
    <>
      {loading
      ? <Loading />
      : <div className="w-full h-full p-4 flex flex-col">
        <section className="min-h-16 flex flex-col gap-5">
          <div className="text-left">
            <h1 className="text-2xl">Buscar Acompanhamentos</h1>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-4">
            <div>
              <StudentCombobox
                student={formData.student}
                setStudent={(student: iStudent | undefined) =>
                  setFormData((prev) => ({ ...prev, student }))
                }
              />
            </div>
            <div>
              <EnterpriseCombobox 
                enterprise={formData?.enterprise} 
                setEnterprise={(enterprise: iEnterprise | undefined) => 
                  setFormData((prev) => ({ ...prev, enterprise }))
                }
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
              <Input 
                id="job_title"
                name="job_title"
                value={formData?.job_title || ''}
                onChange={handleInputChange}
                placeholder="Função" 
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
              <Input 
                id="hr_resposible"
                name="hr_resposible"
                value={formData?.hr_resposible || ''}
                onChange={handleInputChange}
                placeholder="Responsável RH" 
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
              <MaskedInput 
                value={formData?.hr_contact || ''}
                placeholder="Contato RH"
                mask={[{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }]}
                onChange={(val) => handleMaskedInputChange("hr_contact",val)}
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
              <Input 
                id="admission_date"
                name="admission_date"
                value={formData?.admission_date}
                onChange={handleInputChange}
                placeholder="Data Admissão" 
                type="date" 
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
              <Input
                id="termination_date_ieedf"
                name="termination_date_ieedf"
                value={formData?.termination_date_ieedf}
                onChange={handleInputChange}
                placeholder="Provável data desligamento IEEDF" type="date" />
            </div>
            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
              <Button onClick={handleSearch} className="w-full">Buscar</Button>
            </div>
          </div>
        </section>

        <Separator className="mt-6" />

        <section className="flex flex-auto flex-col mt-4 w-full gap-4 mb-4">
          { monitorings != undefined || error
          ?<div>
              {error ? error : `Quantidade de acompanhamentos encontrados: ${totalItems}`}
          </div>
          :""
          }
          {monitorings && monitorings[0]
          ?<DataTable
            columns={monitoringColumns}
            data={monitorings}
            canEdit={true}
            canDelete={true}
            handleDelete={handleAlertConfirm}
            handleEdit={handleEdit}
          />
          : ""}
        </section>

        <PaginationComponent
            cbNext={() => hasNextPage && setCurrentPage(prev => prev + 1)}
            cbPrevius={() => hasPreviousPage && setCurrentPage(prev => prev - 1)}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            pageActivated={currentPage}
        />

        <button
          className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer"
          onClick={() => {
            router.push("/student/monitoring/create");
          }}
        >+
        </button>

        <DefaultAlertDialog 
            message={alertDesc} 
            title={alertTitle} 
            open={alertOpen} 
            textBtn="Confirmar" 
            onClickBtn={handleDelete} 
            onOpenChange={setAlertOpen}
        />

        <InfoAlertDialog 
            message={alertDesc} 
            title={alertTitle} 
            open={infoAlertOpen} 
            onOpenChange={setInfoAlertOpen}
            onClickBtn={undefined}
        />
      </div>
      }
    </>
  );
}