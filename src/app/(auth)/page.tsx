'use client';

import { selectCurrentUser } from "@/store/features/userSlice";
import { useSelector } from "react-redux";

export default function HomePage() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div className="flex-1 flex items-center justify-center w-full h-full">
      {`Bem vindo(a) ${currentUser?.name ? currentUser?.name : ""}!`}
    </div>
  );
}