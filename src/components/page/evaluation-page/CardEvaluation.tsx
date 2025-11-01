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
import { formatDate } from "@/lib/format";
import { iEvaluation } from "@/types/evaluation";
import { useRouter } from "next/navigation"

export default function CardEvaluation(evaluation:iEvaluation) {

  const router = useRouter();

  return (
    <Card className="w-full max-w-sm hover:scale-110 transition-all ease-in cursor-pointer" onClick={() => {router.push(`evaluation/${evaluation.id}`)}}>
      <CardHeader>
        <CardTitle>{evaluation?.student?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Data da entrada: {evaluation?.entry_date ? formatDate(evaluation?.entry_date) : ""} <br/>
          Data da avaliação: {evaluation?.date ? formatDate(evaluation?.date) : ""}
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
