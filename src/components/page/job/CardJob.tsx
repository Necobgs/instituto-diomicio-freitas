"use client";

import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { iJobForm } from "@/types/job"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export default function CardJob(job:iJobForm) {

  const router = useRouter();

  return (
    <Card className="w-full hover:scale-110 transition-all ease-in cursor-pointer relative" onClick={() => {router.push(`/job/${job.id}`)}}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full ${!job.deleted_at ? 'bg-green-700' : 'bg-red-500'}`}></div>
        </TooltipTrigger>
        <TooltipContent className="break-words max-w-[260px]">
          {job.deleted_at ? " Inativo" : "Ativo"}
        </TooltipContent>
      </Tooltip>
      <CardHeader>
        <CardTitle>{job.name}</CardTitle>
      </CardHeader>
    </Card>
  )
}
