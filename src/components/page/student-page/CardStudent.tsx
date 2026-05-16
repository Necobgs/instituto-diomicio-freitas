"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCpf, formatDate, formatPhone } from "@/lib/format";
import { iStudentForm } from "@/types/student"
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export default function CardStudent(student:iStudentForm) {

    const router = useRouter();

    return (
        <Card className="w-full hover:scale-110 transition-all ease-in cursor-pointer relative" onClick={() => {router.push(`/student/${student.id}`)}}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full ${!student.deleted_at ? 'bg-green-700' : 'bg-red-500'}`}></div>
                </TooltipTrigger>
                <TooltipContent className="break-words max-w-[260px]">
                    {student.deleted_at ? " Inativo" : "Ativo"}
                </TooltipContent>
            </Tooltip>
            <CardHeader>
                <CardTitle>{student.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    <div className="text-black/80"><span className="font-semibold">CPF:</span> {formatCpf(student.cpf)}</div>
                    <div className="text-black/80"><span className="font-semibold">Data de nascimento:</span> {formatDate(student.dateBirthday)}</div>
                    <div className="text-black/80"><span className="font-semibold">Telefone:</span> {formatPhone(student.phone)}</div>
                    <div className="text-black/80"><span className="font-semibold">Responsável:</span> {student.responsibleName}</div>
                    <div className="text-black/80"><span className="font-semibold">Telefone Resp.:</span> {formatPhone(student.responsiblePhone)}</div>
                    <div className="text-black/80"><span className="font-semibold">Data de entrada:</span> {formatDate(student.dateEntry)}</div>
                    <div className="text-black/80"><span className="font-semibold">Usa medicamentos:</span> {student.useMedicine ? "Sim" : "Não"}</div>
                    <div className="text-black/80">
                        <span className="flex items-center gap-1 h-6 font-semibold">Info. medicamentos:
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="cursor-default">
                                        <Info size={18}/>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="break-words max-w-[260px]">
                                    {student.infoMedicine || "Nenhuma informação sobre medicamentos"}
                                </TooltipContent>
                            </Tooltip>
                        </span>
                    </div>
                </CardDescription>
            </CardContent>
            <CardFooter className="flex-col gap-2">
            </CardFooter>
        </Card>
    )
}
