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
import { iEnterprise } from "@/types/enterprise"
import { useRouter } from "next/navigation"

export default function CardEnterprise(enterprise:iEnterprise) {

  const router = useRouter();

  return (
    <Card className="w-full max-w-sm hover:scale-110 transition-all ease-in cursor-pointer" onClick={() => {router.push(`/enterprise/${enterprise.id}`)}}>
      <CardHeader>
        <CardTitle>{enterprise.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {enterprise.phone}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Label>{enterprise.cnpj}</Label>
      </CardFooter>
    </Card>
  )
}
