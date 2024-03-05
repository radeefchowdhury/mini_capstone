"use client"
import DashboardPanel from "@/app/components/Dashboard/DashboardPanel";
import React, {useEffect} from "react";
import CondoTable from "@/app/dashboard/units/CondoTable";
import {UserType} from "@/app/constants/types";
function Page() {

    const [userType, setUserType] = React.useState<UserType>();
    const [userId, setUserId] = React.useState<string>();

    const registerNewProperty = () => {

    }

    useEffect(() => {
        setUserType(localStorage.getItem('user_role') as unknown as UserType);
        setUserId(localStorage.getItem('user_id') as string);
    }, []);

    return (
        <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
            <div className={"min-w-0 max-w-fit"}>
                <DashboardPanel
                    title={'My Properties'}
                    buttonTitle={'Register New Property'}
                    onClick={registerNewProperty}/>
            </div>
            <div className={"min-w-[370px]"}>
                <DashboardPanel title={'Condo Unit Information'} onClick={() => {}}/>
            </div>
        </div>
    );
}

export default Page;