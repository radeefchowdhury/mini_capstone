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
import ParkingLockerView from "@/app/components/dashboard/ParkingLockerView";

const propertyTableHeaders = [
    {name: 'Property Name', key: 'name'},
    {name: 'Address', key: 'address'},
    {name: 'Unit Count', key: 'unit_count'},
    {name: 'Parking Spots', key: 'parking_count'},
    {name: 'Lockers', key: 'locker_count'},
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
    const [selectedPropertyView, setSelectedPropertyView] = React.useState<PropertyType>({} as PropertyType);

    const [viewParkingLocker, setViewParkingLocker] = React.useState<boolean>(false);
    const [parkingLockerView, setParkingLockerView] = React.useState<'PARKING' | 'LOCKER'>('PARKING');
    const [parkingLockerList, setParkingLockerList] = React.useState<any[]>([]);


    const selectProperty = (property: PropertyType) => {
        setSelectedProperty(property)
        setFormAction('EDIT')
    }
    const registerNewProperty = () => {
        setFormAction('CREATE')
    }

    const viewPropertyFiles = (property: PropertyType) => {
        setSelectedPropertyView(property)
        setViewFiles(true)
    }

    const submitNewProperty = () => {
        submitPropertyProfile(newPropertyProfile).catch(console.error)
    }

    const viewParkingLockerOnClick = (property: PropertyType, type: 'PARKING' | 'LOCKER') => {
        setSelectedPropertyView(property)
        setViewParkingLocker(true)
        setParkingLockerView(type)
        setParkingLockerList(type == 'PARKING' ? property.parking_spots || [] : property.lockers || [])
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

    const editProperty = async () => {
        if(!selectedProperty) return;
        // delete columns: units, parking_spots, lockers from property
        delete selectedProperty.units;
        delete selectedProperty.parking_spots;
        delete selectedProperty.lockers;
        await submitPropertyProfile(selectedProperty).then(res => {
            fetchPropertyData().catch(console.error)
        })
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
            const fileCount = property.units?.reduce((acc: number, unit) => {
                return acc + (unit.files ? unit.files.length : 0);
            }, 0) || 0;
            return {
                id: property.id,
                name: property.name,
                address: property.address,
                unit_count:  <span>{property.units?.length || 0}</span>,
                parking_count: <ActionButton text={"View Parking (" + property.parking_spots?.length +")"} onClick={() => viewParkingLockerOnClick(property, 'PARKING')}/>,
                locker_count: <ActionButton text={"View Lockers (" + property.lockers?.length +")"} onClick={() => viewParkingLockerOnClick(property, 'LOCKER')}/>,
                condo_files: <ActionButton text={"View Files (" + fileCount + ")"} onClick={() => viewPropertyFiles(property)}/>,
                edit: <ActionIcon Icon={PencilSquareIcon} onClick={() => selectProperty(property)}/>
            }
        })
        // sort by id
        filteredData.sort((a, b) => b.id - a.id);
        setFilteredPropertyData(filteredData)
    }, [propertyData]);

    useEffect(() => {
        setUserType(localStorage.getItem('user_role') as unknown as UserType);
        setUserId(localStorage.getItem('user_id') as string);
    }, []);

    useEffect(() => {
        console.log(selectedProperty)
    }, [selectedProperty]);

    return (
        <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
            <PropertyFilesView
                isVisible={viewFiles}
                setIsVisible={setViewFiles}
                property={selectedPropertyView}
            />
            <ParkingLockerView
                type={parkingLockerView}
                view={userType == 'COMPANY' ? 'COMPANY' : 'PUBLIC'}
                from={'PROPERTY'}
                isVisible={viewParkingLocker}
                selectedItem={selectedPropertyView}
                items={parkingLockerList}
                setIsVisible={setViewParkingLocker}
            />
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
                        onClick={editProperty}/>
                </div>
            }
        </div>
    );
}

export default Page;