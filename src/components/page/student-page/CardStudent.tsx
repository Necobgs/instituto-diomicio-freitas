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
import { iStudent } from "@/types/student"
import { useRouter } from "next/navigation";

export default function CardStudent(student:iStudent) {

    const router = useRouter();

    return (
        <Card className="w-full hover:scale-110 transition-all ease-in cursor-pointer relative" onClick={() => {router.push(`/student/${student.id}`)}}>
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full ${student.enabled ? 'bg-green-700' : 'bg-red-500'}`}></div>
            <CardHeader>
                <CardTitle>{student.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    {formatDate(student.date_of_birth)}
                </CardDescription>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Label>{formatPhone(student.phone)}</Label>
                <Label>{formatCpf(student.cpf)}</Label>
            </CardFooter>
        </Card>
    )
}
