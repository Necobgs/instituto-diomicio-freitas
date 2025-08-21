import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { iUser } from "@/types/user"

export default function CardUser(user:iUser) {
  return (
    <Card className="w-full max-w-sm hover:scale-110 transition-all ease-in">
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
