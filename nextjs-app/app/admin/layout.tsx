import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {

    // Protect the page from users who are not admins
    const isAdmin = await checkRole('admin')
    if (!isAdmin) {
        redirect('/')
    }



    return (

        <>
            {children}
        </>
    )

}
