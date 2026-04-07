"use client";

import CardMonitoring from "@/components/page/monitoring/CardMonitoring";
import { DefaultAlertDialog, InfoAlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { initMonitorings, selectMonitoringError, selectMonitoringHasNextPage, selectMonitoringHasPreviousPage, selectMonitoringLoading, selectMonitorings, selectMonitoringCount } from "@/store/features/monitoringSlice";
import { useAppDispatch } from "@/store/hooks";
import { defaulFilterMonitoring } from "@/types/monitoring";
import { iStudentForm } from "@/types/student";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MonitoringPage() {
  const router = useRouter();
  const monitorings = useSelector(selectMonitorings);
  const countItems = useSelector(selectMonitoringCount);
  const loading = useSelector(selectMonitoringLoading);
  const error = useSelector(selectMonitoringError);
  const hasNextPage = useSelector(selectMonitoringHasNextPage);
  const hasPreviousPage = useSelector(selectMonitoringHasPreviousPage);
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState(defaulFilterMonitoring);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  return (
    <>
      {loading
      ? <Loading />
      : <div className="w-full h-full p-4 flex flex-col">
        <section className="min-h-16 flex flex-col gap-5">
          <div className="text-left">
            <h1 className="text-2xl">Buscar acompanhamentos</h1>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-4">
            <div>
              <StudentCombobox
                student={formData.student}
                setStudent={(student: iStudentForm | undefined) =>
                  setFormData((prev) => ({ ...prev, student }))
                }
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
              <Input 
                id="visitDateIni"
                name="visitDateIni"
                value={formData?.visitDateIni || ''}
                onChange={handleInputChange}
                placeholder="Data Início Visita" 
                type="date"
              />
            </div>
            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
              <Input 
                id="visitDateEnd"
                name="visitDateEnd"
                value={formData?.visitDateEnd || ''}
                onChange={handleInputChange}
                placeholder="Data Fim Visita" 
                type="date"
              />
            </div>
            <div>
                <Combobox
                    items={[{ value: "all", label: "Ambos"}, { value: "true", label: "Ativos" }, { value: "false", label: "Inativos" }]}
                    value={formData?.enabled}
                    setValue={(value) => setFormData(prev => ({ ...prev, enabled: value }))}
                    placeholder="Selecione a situação..."
                    searchPlaceholder="Buscar situação..."
                    notFoundMessage="Nenhuma situação encontrada"
                />
            </div>
            <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
              <Button onClick={handleSearch} className="w-full">Buscar</Button>
            </div>
          </div>
        </section>

        <Separator className="mt-6" />

        <section className="flex flex-auto flex-col mt-4 w-full gap-4 mb-4">
          <div>
              {error ? error : `Quantidade de acompanhamentos encontrados: ${countItems}`}
          </div>

          <div className="mt-5 grid gap-5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] mb-5">
              {monitorings?.[0] && monitorings.map(monitoring=>
                  <CardMonitoring {...monitoring} key={monitoring.id}/>
              )}
          </div>
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
      </div>}
    </>
  );
}