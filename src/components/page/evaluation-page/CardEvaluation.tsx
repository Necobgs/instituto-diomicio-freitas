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
import { iEvaluationForm } from "@/types/evaluation";
import { useRouter } from "next/navigation"

export default function CardEvaluation(evaluation:iEvaluationForm) {

  const router = useRouter();

  return (
    <Card className="w-full max-w-sm hover:scale-110 transition-all ease-in cursor-pointer relative" onClick={() => {router.push(`evaluation/${evaluation.id}`)}}>
      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full ${!evaluation.deleted_at ? 'bg-green-700' : 'bg-red-500'}`}></div>
      <CardHeader>
        <CardTitle>{evaluation?.student?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <div className="text-black/80"><span className="font-semibold">Professor:</span> {evaluation?.user?.username}</div>
          <div className="text-black/80"><span className="font-semibold">Data da avaliação:</span> {evaluation?.date ? formatDate(evaluation?.date) : ""}</div>
          <div className="text-black/80"><span className="font-semibold">Nota da entrevista com os pais:</span> {evaluation.interviewNote}</div>
          <div className="text-black/80"><span className="font-semibold">Nota da avaliação:</span> {evaluation.note}</div>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  )
}
