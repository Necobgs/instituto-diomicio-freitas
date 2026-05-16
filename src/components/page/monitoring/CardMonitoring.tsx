"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDate } from "@/lib/format";
import { iMonitoringForm } from "@/types/monitoring";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export default function CardMonitoring(monitoring:iMonitoringForm) {

  const router = useRouter();

  return (
    <Card className="w-full max-w-sm hover:scale-110 transition-all ease-in cursor-pointer relative" onClick={() => {router.push(`monitoring/${monitoring.id}`)}}>
      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full ${!monitoring.deleted_at ? 'bg-green-700' : 'bg-red-500'}`}></div>
      <CardHeader>
        <CardTitle>{monitoring?.student?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <div className="text-black/80"><span className="font-semibold">Data da visita:</span> {formatDate(monitoring?.visitDate)}</div>
          <div className="text-black/80">
              <span className="flex items-center gap-1 h-6 font-semibold">Observaçõess:
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <span className="cursor-help">
                              <Info size={18}/>
                          </span>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="break-words max-w-[260px]">
                          {monitoring?.observations || "Nenhuma observação"}
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
