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
import { iStudent } from "@/types/student"
import { useRouter } from "next/navigation";

export default function CardStudent(student:iStudent) {

    const router = useRouter();

    return (
        <Card className="w-full max-w-sm hover:scale-110 transition-all ease-in cursor-pointer" onClick={() => {router.push(`/student/${student.id}`)}}>
            <CardHeader>
                <CardTitle>{student.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                {student.date_of_birth.toLocaleDateString("pt-BR")}
                </CardDescription>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Label>{student.cpf}</Label>
            </CardFooter>
        </Card>
    )
}
