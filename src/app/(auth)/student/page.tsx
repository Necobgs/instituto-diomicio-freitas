"use client";

import CardStudent from "@/components/page/student-page/CardStudent";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { ExportModal } from "@/components/ui/export-modal";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import MaskedInput from "@/components/ui/masked-input";
import { PaginationComponent } from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { can } from "@/functions/can";
import { formatExportDate } from "@/functions/export";
import { formatCpf, formatPhone } from "@/lib/format";
import { initStudents, selectStudentError, selectStudentLoading, selectStudents, selectStudentCount, selectStudentHasNextPage, selectStudentHasPreviousPage } from "@/store/features/studentSlice";
import { selectCurrentUser } from "@/store/features/userSlice";
import { useAppDispatch } from "@/store/hooks";
import { defaultFilterStudent } from "@/types/student";
import { Download, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function StudentPage(){

    const router = useRouter();
    const dispatch = useAppDispatch();
    const students = useSelector(selectStudents);
    const countItems = useSelector(selectStudentCount);
    const loading = useSelector(selectStudentLoading);
    const error = useSelector(selectStudentError);
    const hasNextPage = useSelector(selectStudentHasNextPage);
    const hasPreviousPage = useSelector(selectStudentHasPreviousPage);
    const currentUser = useSelector(selectCurrentUser);
    const [exportOpen, setExportOpen] = useState(false);

    const [formData, setFormData] = useState(defaultFilterStudent);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const getExportRows = () => {
        const header = ["Nome", "CPF", "Data de nascimento", "Telefone", "Nome do responsável", "Telefone do responsável", "Data de entrada", "Usa medicamentos?", "Informações sobre medicamentos", "Situação"];
        const rows = students?.map((student) => [
            student.name || "",
            formatCpf(student.cpf),
            formatExportDate(student.dateBirthday),
            formatPhone(student.phone),
            student.responsibleName || "",
            formatPhone(student.responsiblePhone) || "",
            formatExportDate(student.dateEntry),
            student.useMedicine ? "Sim" : "Não",
            student.infoMedicine || "",
            student.deleted_at ? "Inativo" : "Ativo",
        ]) || [];

        return [header, ...rows];
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMaskedInputChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        if (currentPage === 1)  {
            if (can(currentUser,"student","read")) {
                dispatch(initStudents({...formData, page: currentPage, limit: itemsPerPage }));
            }
        }
        else {
            setCurrentPage(1);
        }
    }

    useEffect(() => {
        if (can(currentUser,"student","read")) {
            dispatch(initStudents({...formData, page: currentPage, limit: itemsPerPage }));
        }
    }, [dispatch, currentPage]);
    
    return (
        <>
            {loading
            ?<Loading/>
            :<div className="w-full h-full p-4 flex flex-col">
                <section className="min-h-16 flex flex-col gap-5">
                    <div className="text-left">
                    <h1 className="text-2xl">Buscar alunos</h1>
                    </div>
                    <div className="flex flex-wrap items-center justify-start gap-4">
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <Input                          
                                id="name"
                                name="name"
                                value={formData?.name || ''}
                                onChange={handleInputChange}
                                placeholder="Nome da aluno"
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <MaskedInput 
                                value={formData?.cpf || ''}
                                placeholder="CPF do aluno"
                                mask="000.000.000-00"
                                onChange={(val) => handleMaskedInputChange("cpf",val)}
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <MaskedInput 
                                value={formData?.phone || ''}
                                placeholder="Telefone do aluno"
                                mask={[{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }]}
                                onChange={(val) => handleMaskedInputChange("phone",val)}
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <Input                          
                                id="responsibleName"
                                name="responsibleName"
                                value={formData?.responsibleName || ''}
                                onChange={handleInputChange}
                                placeholder="Nome do responsável"
                            />
                        </div>
                         <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <MaskedInput 
                                value={formData?.responsiblePhone || ''}
                                placeholder="Telefone do responsável"
                                mask={[{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }]}
                                onChange={(val) => handleMaskedInputChange("responsiblePhone",val)}
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <Input 
                                id="dateEntryIni"
                                name="dateEntryIni"
                                value={formData?.dateEntryIni}
                                onChange={handleInputChange}
                                placeholder="Data de entrada início" 
                                type="date" 
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <Input
                                id="dateEntryEnd"
                                name="dateEntryEnd"
                                value={formData?.dateEntryEnd}
                                onChange={handleInputChange}
                                placeholder="Data de entrada fim"
                                type="date" 
                            />
                        </div>
                        <div>
                            <Combobox
                                items={[{ value: "true", label: "Sim" }, { value: "false", label: "Não" }]}
                                value={formData?.useMedicine}
                                setValue={(value) => setFormData(prev => ({ ...prev, useMedicine: value }))}
                                placeholder="Usa medicamentos?"
                                searchPlaceholder="Buscar opção..."
                                notFoundMessage="Nenhuma situação encontrada"
                            />
                        </div>
                        <div>
                            <Combobox
                                items={[{value: "all", label: "Ambos" }, { value: "true", label: "Ativos" }, { value: "false", label: "Inativos" }]}
                                value={formData?.enabled}
                                setValue={(value) => setFormData(prev => ({ ...prev, enabled: value }))}
                                placeholder="Selecione a situação..."
                                searchPlaceholder="Buscar situação..."
                                notFoundMessage="Nenhuma situação encontrada"
                            />
                        </div>
                        <div className="flex-1 min-w-[200px] max-w-full sm:max-w-[calc(50%-1rem)] md:max-w-[calc(33.33%-1rem)] lg:max-w-[calc(20%-1rem)]">
                            <Button className="w-full" onClick={handleSearch}>Buscar</Button>
                        </div>
                    </div>
                </section>

                <Separator className="mt-6"/>
                
                <section className="mt-4 flex-auto">
                    <div>
                        {error ? error: `Quantidade de alunos encontrados: ${countItems}`}
                    </div>
                    
                    <div className="mt-5 grid gap-5 grid-cols-[repeat(auto-fill,minmax(240px,1fr))] mb-5">
                        {
                            students?.[0] &&
                            students.map(student=>
                                <CardStudent {...student} key={student.id}/>
                            )
                        }
                    </div>
                </section>

                <PaginationComponent
                    cbNext={() => hasNextPage && setCurrentPage(prev => prev + 1)}
                    cbPrevius={() => hasPreviousPage && setCurrentPage(prev => prev - 1)}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    pageActivated={currentPage}
                />

                <ExportModal
                    open={exportOpen}
                    onOpenChange={setExportOpen}
                    name="alunos"
                    title="Alunos"
                    rows={getExportRows()}
                />
                
                <button className="flex items-center justify-center fixed bottom-5 right-22  text-white p-4 rounded-full shadow-lg bg-gray-400 hover:bg-gray-500 w-15 h-15 font-semibold text-lg cursor-pointer" onClick={() => {setExportOpen(true)}}><Download size={18}/></button>

                {can(currentUser,"student","create") && (
                    <button className="flex items-center justify-center fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer" onClick={() => {router.push('/student/create')}}><Plus size={18}/></button>
                )}
            </div>}
        </>
    )
}