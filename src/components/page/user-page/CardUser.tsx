import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { iUser } from "@/types/user"
import React, { MouseEventHandler } from "react"

interface iProps{
  user:iUser,
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

export default function CardUser({user, onClick} : iProps) {
  return (
    <Card className="w-full hover:scale-110 transition-all ease-in cursor-pointer relative" onClick={onClick}>
      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full ${user.enabled ? 'bg-green-700' : 'bg-red-500'}`}></div>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {user.email}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Label>{user.cpf}</Label>
      </CardFooter>
    </Card>
  )
}
