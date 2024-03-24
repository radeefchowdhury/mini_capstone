"use client"
import DashboardPanel from "@/app/components/dashboard/DashboardPanel";
import React, {useEffect} from "react";
import {PropertyType, UserType} from "@/app/constants/types";
import {getPropertiesFromCompany, submitPropertyProfile} from "@/app/api/property/PropertyAPI";
import ActionButton from "@/app/components/dashboard/ActionButton";
import {log} from "node:util";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import PropertyInfo from "@/app/dashboard/properties/PropertyInfo";
import PopupPanel from "@/app/components/dashboard/PopupPanel";
import ActionIcon from "@/app/components/dashboard/ActionIcon";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import PropertyFilesView from "@/app/dashboard/properties/PropertyFilesView";

const propertyTableHeaders = [
    {name: 'Property Name', key: 'name'},
    {name: 'Address', key: 'address'},
    {name: 'Unit Count', key: 'unit_count'},
    {name: 'Parking Count', key: 'parking_count'},
    {name: 'Locker Count', key: 'locker_count'},
    {name: 'Condo files', key: 'condo_files'},
    {name: 'Actions', key: 'edit'},
]

function Page() {

    const [userType, setUserType] = React.useState<UserType>();
    const [userId, setUserId] = React.useState<string>();
    const [propertyData, setPropertyData] = React.useState<PropertyType[]>([]);
    const [filteredPropertyData, setFilteredPropertyData] = React.useState<any[]>([]);
    const [selectedProperty, setSelectedProperty] = React.useState<PropertyType>();
    const [newPropertyProfile, setNewPropertyProfile] = React.useState<PropertyType>({} as PropertyType);
    const [formAction, setFormAction] = React.useState<'EDIT' | 'CREATE'>();
    const [viewFiles, setViewFiles] = React.useState<boolean>(false);
    const [selectedPropertyFiles, setSelectedPropertyFiles] = React.useState<PropertyType>({} as PropertyType);


    const selectProperty = (property: PropertyType) => {
        setSelectedProperty(property)
        setFormAction('EDIT')
    }
    const registerNewProperty = () => {
        setFormAction('CREATE')
    }

    const viewPropertyFiles = (property: PropertyType) => {
        setSelectedPropertyFiles(property)
        setViewFiles(true)
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
            // property has a list of units, each unit has a list of files
            // I need to get the count of all files in all condos
            // make sure that it is TS compliant
            const fileCount = property.units?.reduce((acc: number, unit) => {
                return acc + (unit.files ? unit.files.length : 0);
            }, 0) || 0;
            return {
                id: property.id,
                name: property.name,
                address: property.address,
                unit_count: property.unit_count,
                parking_count: property.parking_count,
                locker_count: property.locker_count,
                condo_files: <ActionButton title={"View Files (" + fileCount + ")"} onClick={() => viewPropertyFiles(property)}/>,
                edit: <ActionIcon Icon={PencilSquareIcon} onClick={() => selectProperty(property)}/>
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
            <PropertyFilesView isVisible={viewFiles} setIsVisible={setViewFiles} property={selectedPropertyFiles}/>
            <div className={"min-w-0 max-w-fit"}>
                <DashboardPanel
                    title={'My Properties'}
                    buttonTitle={'Register New Property'}
                    children={<DashboardTable items={filteredPropertyData} headers={propertyTableHeaders} />}
                    onClick={registerNewProperty}/>
            </div>
            {(formAction == "CREATE") &&
                <div className={"min-w-[370px]"}>
                <DashboardPanel
                    title={`Create New Property`}
                    buttonTitle={`Submit`}
                    children={<PropertyInfo property={newPropertyProfile} setProperty={setNewPropertyProfile}/>}
                    onClick={submitNewProperty}/>
                </div>
            }
            {(formAction == "EDIT") &&
                <div className={"min-w-[370px]"}>
                    <DashboardPanel
                        title={`Edit Property`}
                        buttonTitle={`Save`}
                        children={<PropertyInfo property={selectedProperty || newPropertyProfile} setProperty={setSelectedProperty}/>}
                        onClick={submitNewProperty}/>
                </div>
            }
        </div>
    );
}

export default Page;