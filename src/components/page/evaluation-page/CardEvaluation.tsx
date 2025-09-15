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
import ievaluation from "@/types/evaluation";
import { useRouter } from "next/navigation"

export default function Cardevaluation(evaluation:ievaluation) {

  const router = useRouter();

  return (
    <Card className="w-full max-w-sm hover:scale-110 transition-all ease-in cursor-pointer" onClick={() => {router.push(`evaluation/${evaluation.id}`)}}>
      <CardHeader>
        <CardTitle>{evaluation?.student?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Data da entrada: {evaluation?.entry_date ? evaluation?.entry_date.toLocaleDateString("pt-BR") : ""} <br/>
          Data da avaliação: {evaluation?.date ? evaluation?.date.toLocaleDateString("pt-BR") : ""}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Label>Nota da entrevista com os pais: {evaluation.interview_note}<br/>
               Nota da avaliação: {evaluation.note}
        </Label>
      </CardFooter>
    </Card>
  )
}
