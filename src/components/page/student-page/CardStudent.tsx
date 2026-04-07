"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { formatCpf, formatDate, formatPhone } from "@/lib/format";
import { iStudentForm } from "@/types/student"
import { useRouter } from "next/navigation";

export default function CardStudent(student:iStudentForm) {

    const router = useRouter();

    return (
        <Card className="w-full hover:scale-110 transition-all ease-in cursor-pointer relative" onClick={() => {router.push(`/student/${student.id}`)}}>
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full ${!student.deleted_at ? 'bg-green-700' : 'bg-red-500'}`}></div>
            <CardHeader>
                <CardTitle>{student.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    <div className="text-black/80"><span className="font-semibold">Usa medicamentos:</span> {student.useMedicine ? "Sim" : "Não"}</div>
                    <div className="text-black/80"><span className="font-semibold">Responsável:</span> {student.responsibleName}</div>
                    <div className="text-black/80"><span className="font-semibold">Telefone Resp.:</span> {formatPhone(student.responsiblePhone)}</div>
                    <div className="text-black/80"><span className="font-semibold">Data de entrada:</span> {formatDate(student.dateEntry)}</div>
                    <div className="text-black/80"><span className="font-semibold">Data de nascimento:</span> {formatDate(student.dateBirthday)}</div>
                    <div className="text-black/80"><span className="font-semibold">Telefone:</span> {formatPhone(student.phone)}</div>
                    <div className="text-black/80"><span className="font-semibold">CPF:</span> {formatCpf(student.cpf)}</div>
                </CardDescription>
            </CardContent>
            <CardFooter className="flex-col gap-2">
            </CardFooter>
        </Card>
    )
}
