
import { ReactNode } from "react";

export default async function EmployeeLayout({ children }: { children: ReactNode }) {

    // const isEmployee = await checkRole('employee');
    // if (!isEmployee) {
    //     redirect('/');
    // }

    return (
        <>
            {children}
        </>
    );
}
