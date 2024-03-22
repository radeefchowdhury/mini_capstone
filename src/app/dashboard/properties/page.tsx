"use client"
import DashboardPanel from "@/app/components/Dashboard/DashboardPanel";
import React, {useEffect} from "react";
import {PropertyType, UserType} from "@/app/constants/types";
import {getPropertiesFromCompany, submitPropertyProfile} from "@/app/api/property/PropertyAPI";
import ActionButton from "@/app/components/Dashboard/ActionButton";
import {log} from "node:util";
import DashboardTable from "@/app/components/Dashboard/DashboardTable";
import PropertyInfo from "@/app/dashboard/properties/PropertyInfo";

const propertyTableHeaders = [
    {name: 'Property Name', key: 'name'},
    {name: 'Address', key: 'address'},
    {name: 'Unit Count', key: 'unit_count'},
    {name: 'Parking Count', key: 'parking_count'},
    {name: 'Locker Count', key: 'locker_count'},
    {name: 'Actions', key: 'edit'},
]

function Page() {

    const [userType, setUserType] = React.useState<UserType>();
    const [userId, setUserId] = React.useState<string>();
    const [propertyData, setPropertyData] = React.useState<PropertyType[]>([]);
    const [filteredPropertyData, setFilteredPropertyData] = React.useState<any[]>([]);
    const [selectedProperty, setSelectedProperty] = React.useState<number>();
    const [newPropertyProfile, setNewPropertyProfile] = React.useState<PropertyType>({} as PropertyType);
    const [formAction, setFormAction] = React.useState<'EDIT' | 'CREATE'>();

    const registerNewProperty = () => {
        setFormAction('CREATE')
    }

    const submitNewProperty = () => {
        submitPropertyProfile(newPropertyProfile).catch(console.error)
    }

    const fetchPropertyData = async () => {
        const {data, error} = await getPropertiesFromCompany(userId);
        if(error){
            console.log(error)
            return
        }
        if(data) setPropertyData(data)
        console.log(data)
    }

    useEffect(() => {
        if(userId && userType){
            fetchPropertyData().catch(console.error);
            setNewPropertyProfile({company_id: userId} as PropertyType)
        }
    }, [userType]);

    useEffect(() => {
        if(propertyData.length == 0) return;
        let filteredData = propertyData.map((property) => {
            return {
                id: property.id,
                name: property.name,
                address: property.address,
                unit_count: property.unit_count,
                parking_count: property.parking_count,
                locker_count: property.locker_count,
                edit: <ActionButton title={'Edit'} onClick={() => {
                    console.log('edit ' + property.id )}
                }/>
            }
        })
        setFilteredPropertyData(filteredData)
    }, [propertyData]);

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
                    children={<DashboardTable items={filteredPropertyData} headers={propertyTableHeaders} />}
                    onClick={registerNewProperty}/>
            </div>
            { (selectedProperty || formAction == "CREATE") &&
                <div className={"min-w-[370px]"}>
                <DashboardPanel
                    title={`${formAction == "EDIT" ? 'Edit Property' : 'Create New Property'}`}
                    buttonTitle={`${formAction == "EDIT" ? 'Save' : 'Submit'}`}
                    children={<PropertyInfo property={newPropertyProfile} setProperty={setNewPropertyProfile}/>}
                    onClick={submitNewProperty}/>
            </div>}
        </div>
    );
}

export default Page;