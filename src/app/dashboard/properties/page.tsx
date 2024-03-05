"use client"
import DashboardPanel from "@/app/components/Dashboard/DashboardPanel";
import React, {useEffect} from "react";
import CondoTable from "@/app/dashboard/properties/CondoTable";
function Page() {

    const [userType, setUserType] = React.useState<'RENTER' | 'OWNER' | 'COMPANY' | null>(null);


    const registerNewUnit = () => {
        // Redirect to the register new unit page
    }

    useEffect(() => {
        if(typeof window === 'undefined') return;
        setUserType(localStorage.getItem('user_role') as 'RENTER' | 'OWNER' | 'COMPANY' | null);
    }, []);

    return (
        <div className={"flex flex-row sm:gap-[36px] gap-[28px]"}>
            <div className={"w-full"}>
                <DashboardPanel
                    title={'My Rented Units'}
                    buttonTitle={'Register New Unit'}
                    children={<CondoTable />}
                    onClick={registerNewUnit}/>
            </div>
            <div className={"max-w-[370px]"}>
                <DashboardPanel title={'Condo Unit Information'} onClick={() => {}}/>
            </div>
        </div>
    );
}

export default Page;