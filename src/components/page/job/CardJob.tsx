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
import { iJobForm } from "@/types/job"
import { useRouter } from "next/navigation"

export default function CardJob(job:iJobForm) {

  const router = useRouter();

  return (
    <Card className="w-full hover:scale-110 transition-all ease-in cursor-pointer relative" onClick={() => {router.push(`/job/${job.id}`)}}>
      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full ${!job.deleted_at ? 'bg-green-700' : 'bg-red-500'}`}></div>
      <CardHeader>
        <CardTitle>{job.name}</CardTitle>
      </CardHeader>
    </Card>
  )
}
