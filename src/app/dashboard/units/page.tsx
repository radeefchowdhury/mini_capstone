"use client"
import DashboardPanel from "@/app/components/Dashboard/DashboardPanel";
import React, {useEffect} from "react";
import CondoTable from "@/app/dashboard/units/CondoTable";
import {getCondoList} from "@/app/api/condo/CondoAPI";
import {CondoUnitType} from "@/app/constants/types";
import DashboardTable from "@/app/components/Dashboard/DashboardTable";

const condoTableHeaders = [
    {name: 'Condo Name', key: 'name'},
    {name: 'Address', key: 'address'},
    {name: 'Condo Number', key: 'number'},
    {name: 'Fee ($)', key: 'fee'},
    {name: 'Size (m²)', key: 'size'},
    {name: 'Parking Count', key: 'parking_spots_length'},
    {name: 'Locker Count', key: 'lockers_length'},
]
function Page() {

    const [userType, setUserType] = React.useState<'RENTER' | 'OWNER' | 'COMPANY'>();
    const [condoData, setCondoData] = React.useState<CondoUnitType[]>([]);
    const [filteredCondoData, setFilteredCondoData] = React.useState<any[]>([]);
    const [userId, setUserId] = React.useState<string>();

    const registerNewUnit = () => {
        // Redirect to the register new unit page
    }

    const fetchCondoData = async () => {
        const {data, error} = await getCondoList(userId);
        if(error){
            console.log(error)
            return
        }
        if(data) setCondoData(data)
    }

    useEffect(() => {
        setUserType(localStorage.getItem('user_role') as 'RENTER' | 'OWNER' | 'COMPANY');
        setUserId(localStorage.getItem('user_id') as string);
    }, []);

    useEffect(() => {
        if(userId && userType) fetchCondoData().catch(console.error);
    }, [userId]);

    useEffect(() => {
        if(condoData.length == 0) return;
        let filteredData = condoData.map((unit) => {
            return {
                id: unit.id,
                name: unit.name,
                number: unit.number,
                address: unit.property.address,
                description: unit.description,
                fee: unit.fee,
                size: unit.size,
                parking_spots_length: unit.parking_spots.length,
                lockers_length: unit.lockers.length,
                registration_key: unit.registration_key,
            }
        })
        setFilteredCondoData(filteredData);
    }, [condoData]);


    return (
        <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
            <div className={"min-w-0 max-w-fit"}>
                <DashboardPanel
                    title={'My Rented Units'}
                    buttonTitle={'Register New Unit'}
                    children={<DashboardTable items={filteredCondoData} headers={condoTableHeaders} />}
                    onClick={registerNewUnit}/>
            </div>
            <div className={"min-w-[370px]"}>
                <DashboardPanel title={'Condo Unit Information'} onClick={() => {}}/>
            </div>
        </div>
    );
}

export default Page;