"use client"
import DashboardPanel from "@/app/components/dashboard/DashboardPanel";
import React, {useEffect} from "react";
import {
    getCondosFromCompany,
    getCondosFromOccupant,
    getPropertiesFromCompany,
    registerCondoUnitWithKey,
    submitCondoProfile,
    updateRegistrationKey
} from "@/app/api/property/PropertyAPI";
import {CondoUnitType, PropertyType, UserType} from "@/app/constants/types";
import DashboardTable from "@/app/components/dashboard/DashboardTable";
import CondoUnitInfo from "@/app/dashboard/units/CondoUnitInfo";
import ActionButton from "@/app/components/dashboard/ActionButton";
import KeyForm from "@/app/dashboard/units/KeyForm";
import ActionIcon from "@/app/components/dashboard/ActionIcon";
import {PencilSquareIcon} from "@heroicons/react/24/outline";
import UnitsFilesView from "@/app/dashboard/units/UnitsFilesView";
import ParkingLockerView from "@/app/components/dashboard/ParkingLockerView";
import {getParkingLockerListFromProperty} from "@/app/api/property/ParkingLockerAPI";

const condoTableHeaders = [
    {name: 'ID', key: 'id'},
    {name: 'Condo Name', key: 'name'},
    {name: 'Property Name', key: 'property_name'},
    {name: 'Address', key: 'address'},
    {name: 'Condo Number', key: 'number'},
    {name: 'Size (m²)', key: 'size'},
    {name: 'Parking Spots', key: 'view_parking'},
    {name: 'Lockers', key: 'view_lockers'},
    {name: 'View Files', key: 'view_files'},
]

const condoTableHeadersForCompany = [
    {name: 'ID', key: 'id'},
    {name: 'Condo Name', key: 'name'},
    {name: 'Property Name', key: 'property_name'},
    {name: 'Address', key: 'address'},
    {name: 'Condo Number', key: 'number'},
    {name: 'Size (m²)', key: 'size'},
    {name: 'Parking Spots', key: 'view_parking'},
    {name: 'Lockers', key: 'view_lockers'},
    {name: 'View Files', key: 'view_files'},
    {name: 'Registration Key', key: 'registration_key'},
    {name: 'Occupied By', key: 'occupant'},
    {name: 'Actions', key: 'actions'},
]

function Page() {

    const [userType, setUserType] = React.useState<UserType>();
    const [userId, setUserId] = React.useState<string>();
    const [condoData, setCondoData] = React.useState<CondoUnitType[]>([]);
    const [filteredCondoData, setFilteredCondoData] = React.useState<any[]>([]);

    const [propertyList, setPropertyList] = React.useState<PropertyType[]>([]);
    const [selectedCondo, setSelectedCondo] = React.useState<CondoUnitType>();
    const [newCondoProfile, setNewCondoProfile] = React.useState<CondoUnitType>({} as CondoUnitType);
    const [formAction, setFormAction] = React.useState<'EDIT' | 'CREATE'>();
    const [viewFiles, setViewFiles] = React.useState<boolean>(false);

    const [selectedCondoView, setSelectedCondoView] = React.useState<CondoUnitType>({} as CondoUnitType);
    const [viewParkingLocker, setViewParkingLocker] = React.useState<boolean>(false);

    const [parkingLockerView, setParkingLockerView] = React.useState<'PARKING' | 'LOCKER'>('PARKING');
    const [parkingLockerList, setParkingLockerList] = React.useState<any[]>([]);

    const [registrationKey, setRegistrationKey] = React.useState<string>("");

    const registerNewUnit = () => {
        // Toggle Form
        setFormAction(formAction ? undefined : 'CREATE')
    }

    const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };


    const generateRegistrationKey = async (unit_id: any) => {
        const key = generateUUID();
        await updateRegistrationKey(unit_id, key).catch(console.error)
    }

    const registerCondoWithKey = () => {
        if(!registrationKey) return
        registerCondoUnitWithKey(userId, registrationKey).catch(console.error)
    }

    const submitNewUnit = () => {
        const condoToSubmit = {
            name: newCondoProfile.name,
            number: newCondoProfile.number,
            description: newCondoProfile.description || "",
            fee: newCondoProfile.fee,
            size: newCondoProfile.size,
            property_id: newCondoProfile.property_id,
        }
        submitCondoProfile(condoToSubmit).catch(console.error)
    }

    const selectCondoUnit = (unit: CondoUnitType) => {
        setFormAction('EDIT')
        setSelectedCondo(unit)
    }

    const viewCondoFiles = (unit: CondoUnitType) => {
        setSelectedCondoView(unit)
        setViewFiles(true)
    }

    const viewParkingLockerOnClick = async (unit: CondoUnitType, type: 'PARKING' | 'LOCKER') => {
        setSelectedCondoView(unit)
        setParkingLockerView(type)
        setViewParkingLocker(true)
        if(userType == UserType.COMPANY){
            const {data, error} = await getParkingLockerListFromProperty(unit.property_id, type)
            setParkingLockerList(data || [])
        }
        else setParkingLockerList(type === 'PARKING' ? unit.parking_spots : unit.lockers)
    }

    const fetchCondoData = async () => {
        if(userType === "OWNER" || userType === "RENTER"){
            const {data, error} = await getCondosFromOccupant(userId);
            if(error){
                console.log(error)
                return
            }
            if(data) setCondoData(data)
        }
        if(userType === "COMPANY"){
            const {data: condoData, error: condoError} = await getCondosFromCompany(userId);
            const {data: propertyData, error: propertyError} = await getPropertiesFromCompany(userId);
            if(condoError || propertyError){
                console.log(condoError, propertyError)
                return
            }
            if(condoData) setCondoData(condoData)
            if(propertyData) setPropertyList(propertyData)
        }
    }

    useEffect(() => {
        setUserType(localStorage.getItem('user_role') as unknown as UserType);
        setUserId(localStorage.getItem('user_id') as string);
    }, []);

    useEffect(() => {
        if(userId && userType) fetchCondoData().catch(console.error);
    }, [userId]);

    useEffect(() => {
        if(condoData.length == 0) return;
        let filteredData;
        if(userType === "COMPANY"){
            filteredData = condoData.map((unit) => {
                return {
                    id: unit.id,
                    name: unit.name,
                    number: unit.number,
                    address: unit.property?.address || "",
                    property_name: unit.property?.name || "",
                    description: unit.description,
                    fee: unit.fee,
                    size: unit.size,
                    view_parking: <ActionButton title={`View Parking`} onClick={() => viewParkingLockerOnClick(unit, 'PARKING')}/>,
                    view_lockers: <ActionButton title={`View Lockers`} onClick={() => viewParkingLockerOnClick(unit, 'LOCKER')}/>,
                    view_files: <ActionButton title={`View Files (${unit.files ? unit.files.length : 0})`} onClick={() => viewCondoFiles(unit)}/>,
                    registration_key:
                        <button
                            className={`${unit.registration_key ? 
                                "flex items-center justify-center py-1 px-3 mx-auto bg-blue-500 hover:bg-blue-700 text-white text-sm rounded-md" : 
                                "flex items-center justify-center py-1 px-3 mx-auto bg-gray-300 text-gray-500 text-sm rounded-md cursor-default"}`}
                            onClick={() => navigator.clipboard.writeText(unit.registration_key as string)}
                            disabled={!unit.registration_key}
                            title={unit.registration_key}>
                            {unit.registration_key ? "Copy Key" : "No Key"}
                        </button>,
                    occupant: unit.occupant ?
                        <div>{unit.occupant.first_name + " " + unit.occupant.last_name}</div> :
                        <div className={"text-stone-700 bg-gray-100 p-1 rounded-md"}>Unoccupied</div>,
                    actions: (
                        <div className={"flex flex-row gap-4 py-2 px-3"}>
                            <ActionButton title={'Generate Key'} onClick={() => generateRegistrationKey(unit.id)}/>
                            <ActionIcon Icon={PencilSquareIcon} onClick={() => selectCondoUnit(unit)}/>
                        </div>
                    )
                }
            })
        } else {
        filteredData = condoData.map((unit) => {
            return {
                id: unit.id,
                name: unit.name,
                number: unit.number,
                address: unit.property?.address || "",
                property_name: unit.property?.name || "",
                description: unit.description,
                fee: unit.fee,
                size: unit.size,
                view_parking: <ActionButton title={`View Parking (${unit.parking_spots.length})`} onClick={() => viewParkingLockerOnClick(unit, 'PARKING')}/>,
                view_lockers: <ActionButton title={`View Lockers (${unit.lockers ? unit.lockers.length : 0})`} onClick={() => viewParkingLockerOnClick(unit, 'LOCKER')}/>,
                view_files: <ActionButton title={'View Files'} onClick={() => viewCondoFiles(unit)}/>,
                registration_key: unit.registration_key,
            }
        })
        }
        // sort by property name in ascending order then by unit's id in descending order
        filteredData.sort((a, b) => a.property_name.localeCompare(b.property_name) || b.id - a.id);
        setFilteredCondoData(filteredData);
    }, [condoData]);

    return (
        <div className={"flex flex-col xl:flex-row sm:gap-[36px] gap-[28px]"}>
            <UnitsFilesView
                isVisible={viewFiles}
                setIsVisible={setViewFiles}
                condo={selectedCondoView}
            />
            <ParkingLockerView
                type={parkingLockerView}
                isVisible={viewParkingLocker}
                selectedItem={selectedCondoView}
                setIsVisible={setViewParkingLocker}
                items={parkingLockerList}
                view={userType == UserType.COMPANY ? 'COMPANY' : 'PUBLIC'}
                from={'CONDO'}
            />
            <div className={"min-w-0 max-w-fit"}>
                {(userType == UserType.RENTER || userType == UserType.OWNER) &&
                    <DashboardPanel
                    title={`${ 'My Condo Units'}`}
                    buttonTitle={'Register New Unit'}
                    children={<DashboardTable items={filteredCondoData} headers={condoTableHeaders} />}
                    onClick={registerNewUnit}/>}
                {userType == UserType.COMPANY &&
                    <DashboardPanel
                        title={`${ 'My Condo Units'}`}
                        buttonTitle={'Register New Unit'}
                        children={<DashboardTable items={filteredCondoData} headers={condoTableHeadersForCompany} />}
                        onClick={registerNewUnit}/>}
            </div>
            {(selectedCondo || formAction) &&
            <div className={"min-w-[370px]"}>
                {(userType == UserType.COMPANY) && formAction == "EDIT" &&
                    <DashboardPanel
                    title={`Edit Condo`}
                    buttonTitle={`Save`}
                    children={<CondoUnitInfo unit={selectedCondo || newCondoProfile} setUnit={setSelectedCondo}/>}
                    onClick={submitNewUnit}/>
                }
                {(userType == UserType.COMPANY) && formAction == "CREATE" &&
                    <DashboardPanel
                        title={`Register New Condo`}
                        buttonTitle={`Submit`}
                        children={<CondoUnitInfo unit={newCondoProfile} setUnit={setNewCondoProfile} properties={propertyList}/>}
                        onClick={submitNewUnit}/>
                }
                {(userType == UserType.RENTER || userType == UserType.OWNER) &&
                <DashboardPanel
                    title={`Enter Registration Key`}
                    buttonTitle={`Submit Key`}
                    children={<KeyForm registration_key={registrationKey} setKey={setRegistrationKey}/>}
                    onClick={registerCondoWithKey}/>}
            </div>}
        </div>
    );
}

export default Page;