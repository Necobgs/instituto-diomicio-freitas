"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDate } from "@/lib/format";
import { iNotification } from "@/types/notification";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation"

export default function CardNotification({notification, readNotification}: { notification: iNotification, readNotification: (n: iNotification) => void; }) {

  const router = useRouter();

  return (
    <Card className="w-full relative">
      {notification.read ? "" : <div onClick={() => readNotification(notification)} title="Marcar como lida" className="absolute rounded-full bg-red-400 hover:bg-red-500 text-white p-1 top-2 right-2"><Mail size={14}/></div>}
      <CardHeader>
        <CardTitle>{notification.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {formatDate(notification.date)}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
