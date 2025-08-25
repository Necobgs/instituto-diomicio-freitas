import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { iStudent } from "@/types/student"

export default function CardStudent(student:iStudent) {
  return (
    <Card className="w-full max-w-sm hover:scale-110 transition-all ease-in">
      <CardHeader>
        <CardTitle>{student.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {student.date_of_birth.toLocaleDateString("pt-BR")}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Label>{student.cpf}</Label>
      </CardFooter>
    </Card>
  )
}
