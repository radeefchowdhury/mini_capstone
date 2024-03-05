import React from 'react';
import {PropertyType} from "@/app/constants/types";

interface PropertyInfoProps {
    property: PropertyType;
    setProperty: (property: PropertyType) => void;
}
function PropertyInfo(props: PropertyInfoProps) {
    const {property, setProperty} = props;

    return (
        <div className={"text-slate-500 font-medium flex flex-col gap-3"}>
            <div className="flex flex-col gap-1">
                <label htmlFor="Property Name" className="">Property Name</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={property.name || ""}
                    onChange={(e) => setProperty({...property, name: e.target.value})}
                    type="text" id="name"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="Address" className="">Address</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={property.address || ""}
                    onChange={(e) => setProperty({...property, address: e.target.value})}
                    type="text" id="address" name="address"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="Property Address" className="">Description</label>
                <textarea
                    value={property.description || ""}
                    onChange={(e) => setProperty({...property, description: e.target.value})}
                    id="description" name="description"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="mt-2 flex flex-row gap-10 whitespace-nowrap items-center justify-between">
                <label htmlFor="Unit Count" className="">Unit Count</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={property.unit_count || ""}
                    onChange={(e) => setProperty({...property, unit_count: parseInt(e.target.value)})}
                    type="number" id="unit_count" name="unit_count"
                    className="p-2 w-[100px] md:w-[150px] lg:w-[250px] xl:w-[120px] border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="mt-2 flex flex-row gap-10 whitespace-nowrap items-center justify-between">
                <label htmlFor="Parking Count" className="">Parking Count</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={property.parking_count || ""}
                    onChange={(e) => setProperty({...property, parking_count: parseInt(e.target.value)})}
                    type="number" id="parking_count" name="parking_count"
                    className="p-2 w-[100px] md:w-[150px] lg:w-[250px] xl:w-[120px] border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="mt-2 flex flex-row gap-10 whitespace-nowrap items-center justify-between">
                <label htmlFor="Locker Count" className="">Locker Count</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={property.locker_count || ""}
                    onChange={(e) => setProperty({...property, locker_count: parseInt(e.target.value)})}
                    type="number" id="locker_count" name="locker_count"
                    className="p-2 w-[100px] md:w-[150px] lg:w-[250px] xl:w-[120px] border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>

        </div>
    );
}

export default PropertyInfo;