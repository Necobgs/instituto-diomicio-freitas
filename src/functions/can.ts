import { selectCurrentUser } from "@/store/features/userSlice";
import { iUserForm } from "@/types/user";
import { useSelector } from "react-redux";

export const can = (user: iUserForm | null, resource: string, action: string): boolean => {
    /* TIRAR EMAIL DEPOIS */
    return (user?.permissions?.find((perm) => perm.resource?.identifier === resource && (perm.action?.identifier === action || perm.action?.identifier === "all"))) || user?.email === "lucasrosadaconceicao686@gmail.com" ? true : false;
}