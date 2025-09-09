"use client";

import { useRouter } from "next/navigation";

export default function AvaliationPage(){

    const router = useRouter();

    return (
        <div className="w-full h-full p-4">
            <button className="fixed bottom-5 right-5 bg-red-400 text-white p-4 rounded-full shadow-lg hover:bg-red-500 w-15 h-15 font-semibold text-lg cursor-pointer" onClick={() => {router.push('avaliation/create')}}>+</button>
        </div>
    )
}