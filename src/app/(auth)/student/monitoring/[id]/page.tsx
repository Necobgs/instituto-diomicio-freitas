"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { defaultMonitoring, iMonitoringForm } from "@/types/monitoring";
import { StudentCombobox } from "@/components/ui/combo-box-student";
import { iStudentForm } from "@/types/student";
import { DefaultAlertDialog, InfoAlertDialog } from "@/components/ui/alert-dialog";
import { addMonitoring, editMonitoring, getMonitoringById, removeMonitoring, restoreMonitoring, selectMonitoring, selectMonitoringLoading } from "@/store/features/monitoringSlice";
import { useAppDispatch } from "@/store/hooks";
import { Textarea } from "@/components/ui/textarea";
import { formatDateForInput } from "@/lib/format";
import { useSelector } from "react-redux";
import Loading from "@/components/ui/loading";
import { selectCurrentUser } from "@/store/features/userSlice";
import { can } from "@/functions/can";
import { formatExportDate } from "@/functions/export";
import { ExportModal } from "@/components/ui/export-modal";

export default function MonitoringEditPage() {

  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id?.toString() || "0");
  const [formData, setFormData] = useState<iMonitoringForm>(defaultMonitoring);
  const [alertTitle,setAlertTitle] = useState('');
  const [alertDesc,setAlertDesc] = useState('');
  const [alertOpen,setAlertOpen] = useState(false);
  const [infoAlertOpen,setInfoAlertOpen] = useState(false);
  const [exportOpen,setExportOpen] = useState(false);
  const [isError,setIsError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const monitoring = useSelector(selectMonitoring);
  const loading = useSelector(selectMonitoringLoading);
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const getExportRows = () => {
      const source = formData?.id === monitoring?.id ? formData : monitoring || {};

      const rows: (string | number)[][] = [
          ["Data da visita", formatExportDate(source.visitDate)],
          ["Observações", source.observations || ""]
      ];

      return rows;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof iMonitoringForm]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.student) newErrors.student = "Estudante é obrigatório";
    if (!formData.visitDate) newErrors.visitDate = "Data da visita é obrigatória";
    if (!formData.observations) newErrors.observations = "Observações são obrigatórias";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
          return;
      }

      try {
          const { student, ...rest } = formData;

          const dataToSubmit = {
              ...rest,
              studentId: student?.id,
          };

          await dispatch(editMonitoring({...dataToSubmit})).unwrap();
          handleAlert(false,'Acompanhamento editado com sucesso!');
      } catch (error: any) {
          handleAlert(true,error?.message || 'Erro ao editar acompanhamento');
      }
  };

  const handleEnableOrDisable = async(e: React.FormEvent) => {
      e.preventDefault();

      if (!monitoring?.deleted_at) {
        try {
            await dispatch(removeMonitoring(id)).unwrap();
            handleAlert(false,'Acompanhamento desabilitado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao desabilitar acompanhamento');
        }
      } 
      else {
        try {
            await dispatch(restoreMonitoring(id)).unwrap();
            handleAlert(false,'Acompanhamento reabilitado com sucesso!');
        } catch (error: any) {
            handleAlert(true,error?.message || 'Erro ao reabilitar acompanhamento');
        }
      }

      setAlertOpen(false);
  }

  const getMonitoring = async (id: number) => {
      try {
          await dispatch(getMonitoringById(id)).unwrap();
      } catch (error: any) {
          handleAlert(true,error?.message || 'Erro ao buscar acompanhamento');
      }
  }

  const handleAlert = (error: boolean, message: string) => {
      setAlertTitle(error ? "Erro" : "Sucesso");
      setAlertDesc(message)
      setInfoAlertOpen(true);
      setIsError(error);
  }

  useEffect(() => {
      if (id) {
          getMonitoring(id);
      }
  }, [id]);

  useEffect(() => {
      if (monitoring?.id === id) {
          setFormData({...monitoring});
      }
  }, [monitoring]);

  return (
    <>
      {
        loading
          ? <Loading/>
          : <div className="w-full h-full p-4">
          <section className="min-h-16 flex flex-col gap-5">
            <h1 className="text-2xl">Editar acompanhamento</h1>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 max-w-md"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="student" className="text-sm font-medium">
                  Estudante
                </label>
                <StudentCombobox
                  student={formData.student}
                  setStudent={(student: iStudentForm | undefined) => {
                    setFormData((prev) => ({ ...prev, student }));
                    setErrors((prev) => ({ ...prev, student: '' }));
                  }}
                  error={errors.student}
                />
              </div>
              <div>
                <label htmlFor="visitDate" className="text-sm font-medium">Data da visita</label>
                <Input
                  id="visitDate"
                  name="visitDate"
                  type="date"
                  value={formatDateForInput(formData.visitDate)}
                  onChange={handleInputChange}
                  error={errors.visitDate}
                />
              </div>
              <div>
                <label htmlFor="hr_contact" className="text-sm font-medium">Observações</label>
                <Textarea
                  id="observations"
                  name="observations"
                  value={formData.observations || ""}
                  onChange={handleInputChange}
                  error={errors.observations}
                />
              </div>
              <div className="flex gap-3">
                {!monitoring?.deleted_at &&
                    <>
                        {can(currentUser, "monitoring", "update") && (
                            <Button type="submit">Salvar</Button>
                        )}
                        {can(currentUser, "monitoring", "delete") && (
                            <Button type="button" className="bg-red-500 hover:bg-red-400" onClick={() => {
                                setAlertDesc("Tem certeza que deseja desabilitar este registro?");
                                setAlertOpen(true);
                            }}>
                                Desabilitar
                            </Button>
                        )}
                    </>
                }
                {can(currentUser, "monitoring", "restore") && monitoring?.deleted_at && (
                    <Button type="button" className="bg-green-600 hover:bg-green-500" onClick={() => {
                        setAlertDesc("Tem certeza que deseja reabilitar este registro?");
                        setAlertOpen(true);
                    }}>
                        Reabilitar
                    </Button>
                )}
                <Button type="button" className="bg-gray-500 hover:bg-gray-400" onClick={() => setExportOpen(true)}>
                    Exportar
                </Button>
                <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
              </div>
            </form>
          </section>

          <DefaultAlertDialog
              message={alertDesc}
              title="Confirmação"
              open={alertOpen}
              textBtn="Confirmar"
              onClickBtn={handleEnableOrDisable}
              onOpenChange={setAlertOpen}
          />

          <InfoAlertDialog
              message={alertDesc}
              title={alertTitle}
              open={infoAlertOpen}
              onOpenChange={setInfoAlertOpen}
              onClickBtn={() => {isError ? "" : router.push('/student/monitoring');}}
          />

          <ExportModal
              name={`acompanhamento${monitoring?.id}`}
              title="Acompanhamento"
              rows={getExportRows()}
              open={exportOpen}
              onOpenChange={setExportOpen}
          />
          
        </div>
      }
    </>
  );
}
