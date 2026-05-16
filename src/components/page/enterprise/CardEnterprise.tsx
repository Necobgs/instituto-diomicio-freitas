"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCnpj, formatPhone } from "@/lib/format";
import { iEnterpriseForm } from "@/types/enterprise"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export default function CardEnterprise(enterprise:iEnterpriseForm) {

  const router = useRouter();

  return (
    <Card className="w-full hover:scale-110 transition-all ease-in cursor-pointer relative" onClick={() => {router.push(`/enterprise/${enterprise.id}`)}}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full ${!enterprise.deleted_at ? 'bg-green-700' : 'bg-red-500'}`}></div>
        </TooltipTrigger>
        <TooltipContent className="break-words max-w-[260px]">
          {enterprise.deleted_at ? " Inativo" : "Ativo"}
        </TooltipContent>
      </Tooltip>
      <CardHeader>
        <CardTitle>{enterprise.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <div className="text-black/80"><span className="font-semibold">Telefone:</span> {formatPhone(enterprise.phone)}</div>
          <div className="text-black/80"><span className="font-semibold">CNPJ:</span> {formatCnpj(enterprise.cnpj)}</div>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  )
}
