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
    <Card className="w-full max-w-sm hover:scale-110 transition-all ease-in cursor-pointer" onClick={onClick}>
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
