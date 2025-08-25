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

export default function CardUser(user:iUser) {
  return (
    <Card className="w-full max-w-sm hover:scale-110 transition-all ease-in cursor-pointer">
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
