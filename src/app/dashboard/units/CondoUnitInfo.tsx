import React from 'react';
import {CondoUnitType, PropertyType} from "@/app/constants/types";

interface CondoUnitInfoProps {
    unit: CondoUnitType;
    properties?: PropertyType[];
    setUnit: (unit: CondoUnitType) => void;
}
function CondoUnitInfo(props: CondoUnitInfoProps) {
    const {unit, setUnit} = props;

    return (
        <div className={"text-slate-500 font-medium flex flex-col gap-3"}>
            <div className="flex flex-col gap-1">
                <label htmlFor="Condo Name" className="">Condo Name</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={unit.name || ""}
                    onChange={(e) => setUnit({...unit, name: e.target.value})}
                    type="text" id="name"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            {props.properties && <div className="flex flex-col gap-1">
                <label htmlFor="Property" className="">Property</label>
                <select
                    value={unit.property_id || ""}
                    onChange={(e) => setUnit({...unit, property_id: e.target.value})}
                    id="property_id"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md">
                    <option value={""} disabled>Select Property</option>
                    {props.properties?.map((property) => (
                        <option key={property.id} value={property.id}>{property.name}</option>
                    ))}
                </select>
            </div>}
            {!props.properties && <div className="flex flex-col gap-1">
                <label htmlFor="Property" className="">Property</label>
                <input
                    value={unit.property.name || ""}
                    type="text" id="property_name"
                    className="p-2 w-full border border-slate-300 focus:outline-slate-500 rounded-md" readOnly/>
            </div>}
            <div className="mt-2 flex flex-row gap-10 whitespace-nowrap items-center justify-between">
                <label htmlFor="Condo Number" className="">Condo Number</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={unit.number || ""}
                    onChange={(e) => setUnit({...unit, number: parseInt(e.target.value)})}
                    type="text" id="number" name="number"
                    className="p-2 w-[100px] md:w-[150px] lg:w-[250px] xl:w-[120px] border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="mt-2 flex flex-row gap-10 whitespace-nowrap items-center justify-between">
                <label htmlFor="Fee" className="">Fee ($/m²)</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={unit.fee || ""}
                    onChange={(e) => setUnit({...unit, fee: parseFloat(e.target.value)})}
                    type="number" id="fee" name="fee"
                    className="p-2 w-[100px] md:w-[150px] lg:w-[250px] xl:w-[120px] border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
            <div className="mt-2 flex flex-row gap-10 whitespace-nowrap items-center justify-between">
                <label htmlFor="Size" className="">Size (m²)</label>
                <input
                    pattern={"[A-Za-z]*"}
                    value={unit.size || ""}
                    onChange={(e) => setUnit({...unit, size: parseInt(e.target.value)})}
                    type="number" id="size" name="size"
                    className="p-2 w-[100px] md:w-[150px] lg:w-[250px] xl:w-[120px] border border-slate-300 focus:outline-slate-500 rounded-md"/>
            </div>
        </div>
    );
}

export default CondoUnitInfo;