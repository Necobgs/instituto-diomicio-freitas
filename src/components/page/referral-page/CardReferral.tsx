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
import { iReferralForm } from "@/types/referral";
import { useRouter } from "next/navigation"

export default function CardReferral(referral:iReferralForm) {

  const router = useRouter();

  return (
    <Card className="w-full max-w-sm hover:scale-110 transition-all ease-in cursor-pointer relative" onClick={() => {router.push(`referral/${referral.id}`)}}>
      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full ${!referral.deleted_at ? 'bg-green-700' : 'bg-red-500'}`}></div>
      <CardHeader>
        <CardTitle>{referral?.student?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <div className="text-black/80"><span className="font-semibold">Empresa:</span> {referral?.enterprise?.name}</div>
          <div className="text-black/80"><span className="font-semibold">Cargo:</span> {referral?.job?.name}</div>
          <div className="text-black/80"><span className="font-semibold">Data de admissão:</span> {formatDate(referral?.admissionDate)}</div>
          <div className="text-black/80"><span className="font-semibold">Provável data desligamento IEEDF:</span> {formatDate(referral?.admissionDate)}</div>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex-col gap-2">
      </CardFooter>
    </Card>
  )
}
